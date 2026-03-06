using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NaoConformeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NaoConformeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/NaoConforme
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetHistorico()
        {
            var historico = await _context.NaoConformes
                .Include(n => n.Movimento)
                .ThenInclude(m => m.Defeito)
                .OrderByDescending(n => n.DataRegisto)
                .Select(n => new
                {
                    id = n.Id.ToString(),
                    data = n.DataRegisto.ToString("dd/MM/yyyy HH:mm"),
                    codigoArtigo = n.Movimento.ArtigoCodigo,
                    descricao = n.Movimento.Artigo.Descricao,
                    quantidade = n.Movimento.Quantidade.ToString(),
                    defeito = n.Movimento.Defeito != null ? n.Movimento.Defeito.Descricao : "",
                    destino = n.Movimento.Localizacao,
                    codigoDestino = "", // Pode ser expandido se houver mapeamento
                    estadoMovimentacao = n.Movimento.Estado.ToLower(),
                    observacoes = n.Movimento.Observacoes ?? "",
                    maquinaCodigo = n.Movimento.MaquinaCodigo
                })
                .ToListAsync();

            return Ok(historico);
        }

        // POST: api/NaoConforme
        [HttpPost]
        public async Task<ActionResult> CreateBatch([FromBody] List<NCRequest> requests)
        {
            if (requests == null || !requests.Any()) return BadRequest("Nenhum dado enviado.");

            var tipoNC = await _context.TiposMovimento.FirstOrDefaultAsync(t => t.Descricao == "Não Conformidade");
            if (tipoNC == null) return StatusCode(500, "Tipo de movimento 'Não Conformidade' não configurado.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var req in requests)
                {
                    // Prioridade: 1. Máquina manual (req.maquinaCodigo) | 2. Máquina do Artigo | 3. "ND"
                    string maquinaCodigo = "ND";
                    
                    if (!string.IsNullOrWhiteSpace(req.maquinaCodigo))
                    {
                        maquinaCodigo = req.maquinaCodigo.Trim();
                    }
                    else if (!string.IsNullOrWhiteSpace(req.codigoArtigo))
                    {
                        var cleanCode = req.codigoArtigo.Trim();
                        var artigo = await _context.Artigos.FirstOrDefaultAsync(a => a.ArtigoCodigo == cleanCode);
                        
                        if (artigo != null && !string.IsNullOrWhiteSpace(artigo.MaquinaCodigo))
                        {
                            maquinaCodigo = artigo.MaquinaCodigo;
                        }
                    }

                    // 1. Criar Movimento
                    var movimento = new Movimento
                    {
                        Estado = "pendente",
                        Localizacao = req.destino,
                        DataMovimento = DateTime.UtcNow,
                        Quantidade = decimal.Parse(req.quantidade),
                        Descontar = false, // Conforme pedido: padrão é false, qualidade muda depois
                        ArtigoCodigo = req.codigoArtigo,
                        MaquinaCodigo = maquinaCodigo,
                        TipoMovimentoId = tipoNC.Id,
                        UtilizadorCodigo = req.utilizadorCodigo,
                        Observacoes = req.observacoes
                    };

                    // Procurar o ID do defeito pelo nome se não vier do ID direto
                    if (!string.IsNullOrEmpty(req.defeito))
                    {
                        var def = await _context.CatalogosDefeito.FirstOrDefaultAsync(d => d.Descricao == req.defeito);
                        if (def != null) movimento.DefeitoId = def.Id;
                    }

                    _context.Movimentos.Add(movimento);
                    await _context.SaveChangesAsync(); // Save to get Movimento.Id

                    // 2. Criar NaoConforme
                    var nc = new NaoConforme
                    {
                        DataRegisto = DateTime.UtcNow,
                        IdMovimento = movimento.Id,
                        QtdSage = 0 // A ser preenchido por processos de integração futuros
                    };

                    _context.NaoConformes.Add(nc);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Registos gravados com sucesso." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Erro ao gravar registos: {ex.Message}");
            }
        }
    }

    public class NCRequest
    {
        public string codigoArtigo { get; set; } = string.Empty;
        public string descricao { get; set; } = string.Empty;
        public string quantidade { get; set; } = string.Empty;
        public string destino { get; set; } = string.Empty;
        public string codigoDestino { get; set; } = string.Empty;
        public string defeito { get; set; } = string.Empty;
        public string observacoes { get; set; } = string.Empty;
        public string utilizadorCodigo { get; set; } = string.Empty;
        public string maquinaCodigo { get; set; } = string.Empty;
    }
}
