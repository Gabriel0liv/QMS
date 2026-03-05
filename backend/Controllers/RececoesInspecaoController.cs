using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RececoesInspecaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RececoesInspecaoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RececoesInspecao
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RececaoInspecao>>> GetRececoes(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50,
            [FromQuery] string? status = null)
        {
            var query = _context.RececoesInspecao
                .Include(r => r.Artigo)
                .Include(r => r.Fornecedor)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                var lowerStatus = status.ToLower();
                query = query.Where(r => r.DecisaoFinal.ToLower() == lowerStatus);
            }

            var totalItems = await query.CountAsync();
            var rececoes = await query
                .OrderByDescending(r => r.DataRececao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = rececoes
            });
        }

        // GET: api/RececoesInspecao/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RececaoInspecao>> GetRececaoInspecao(int id)
        {
            var rececao = await _context.RececoesInspecao
                .Include(r => r.Artigo)
                .Include(r => r.Fornecedor)
                .Include(r => r.Utilizador)
                .Include(r => r.Justificacoes)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (rececao == null)
            {
                return NotFound();
            }

            return Ok(rececao);
        }
    }
}
