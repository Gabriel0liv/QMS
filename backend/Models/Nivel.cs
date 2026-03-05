using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Nivel" na base de dados (Ex: Admin, Normal)
    public class Nivel
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Descrição do nível de acesso
        // O UNIQUE será configurado no AppDbContext
        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        // Propriedade de navegação: Um nível pode ter vários utilizadores
        public ICollection<Utilizador> Utilizadores { get; set; } = new List<Utilizador>();
    }
}
