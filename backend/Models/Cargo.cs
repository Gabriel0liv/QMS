using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "cargo" na base de dados
    public class Cargo
    {
        // Chave Primária (PK) - Identificador único do cargo
        [Key]
        public int Id { get; set; }

        // Descrição do cargo (Ex: "Operador")
        // O UNIQUE será configurado no AppDbContext
        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        // Propriedade de navegação: Um cargo pode ter vários utilizadores
        public ICollection<Utilizador> Utilizadores { get; set; } = new List<Utilizador>();
    }
}
