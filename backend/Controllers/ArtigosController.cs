using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArtigosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArtigosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Artigos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artigo>>> GetArtigos(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50,
            [FromQuery] string? search = null)
        {
            var query = _context.Artigos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(a => 
                    a.ArtigoCodigo.ToLower().Contains(lowerSearch) || 
                    a.Descricao.ToLower().Contains(lowerSearch));
            }

            var totalItems = await query.CountAsync();
            var artigos = await query
                .OrderBy(a => a.ArtigoCodigo)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = artigos
            });
        }

        // GET: api/Artigos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Artigo>> GetArtigo(string id)
        {
            var artigo = await _context.Artigos
                .Include(a => a.Familia)
                .Include(a => a.PropriedadesPDM)
                .Include(a => a.Maquina)
                .FirstOrDefaultAsync(a => a.ArtigoCodigo == id);

            if (artigo == null)
            {
                return NotFound();
            }

            return Ok(artigo);
        }
    }
}
