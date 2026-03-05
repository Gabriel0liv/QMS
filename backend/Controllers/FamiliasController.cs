using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FamiliasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FamiliasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Familias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Familia>>> GetFamilias()
        {
            return await _context.Familias.ToListAsync();
        }

        // GET: api/Familias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Familia>> GetFamilia(int id)
        {
            var familia = await _context.Familias.FindAsync(id);

            if (familia == null)
            {
                return NotFound();
            }

            return familia;
        }
    }
}
