using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "diversos" na base de dados
    public class Diversos
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Descrição
        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        // Um item "diverso" pode estar associado a muitos artigos
        public ICollection<Artigo> Artigos { get; set; } = new List<Artigo>();
    }
}
