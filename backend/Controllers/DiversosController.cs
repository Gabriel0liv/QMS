using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiversosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DiversosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Diversos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Diversos>>> GetDiversos()
        {
            return await _context.DiversosLista.ToListAsync();
        }

        // GET: api/Diversos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Diversos>> GetDiverso(int id)
        {
            var diverso = await _context.DiversosLista.FindAsync(id);

            if (diverso == null)
            {
                return NotFound();
            }

            return diverso;
        }
    }
}
