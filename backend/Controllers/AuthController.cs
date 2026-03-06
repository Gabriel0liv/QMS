using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using BCrypt.Net;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var utilizador = await _context.Utilizadores
                .Include(u => u.Cargo)
                .Include(u => u.Nivel)
                .FirstOrDefaultAsync(u => u.UtilizadorCodigo == request.UtilizadorCodigo);

            if (utilizador == null || !utilizador.Active)
            {
                return Unauthorized(new { message = "Utilizador não encontrado ou inativo." });
            }

            bool isValid = BCrypt.Net.BCrypt.Verify(request.Password, utilizador.PasswordHash);

            if (!isValid)
            {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }

            // Nota: Por agora retornamos os dados diretamente. 
            // Numa fase seguinte podemos adicionar a geração de Token JWT real.
            return Ok(new
            {
                user = new
                {
                    utilizador.UtilizadorCodigo,
                    utilizador.Nome,
                    utilizador.Email,
                    Cargo = utilizador.Cargo?.Descricao,
                    Nivel = utilizador.Nivel?.Descricao
                }
            });
        }
    }

    public class LoginRequest
    {
        public string UtilizadorCodigo { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
