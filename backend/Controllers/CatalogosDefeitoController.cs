using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogosDefeitoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CatalogosDefeitoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CatalogoDefeito>>> GetDefeitos([FromQuery] string? search)
        {
            var query = _context.CatalogosDefeito.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(d => d.Descricao.ToLower().Contains(term));
            }

            return await query.OrderBy(c => c.Descricao).Take(15).ToListAsync();
        }
    }
}
