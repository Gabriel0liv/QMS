using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    // Representa a tabela "tipo_movimento" na base de dados (Ex: Entrada, Saída, Sucata)
    public class TipoMovimento
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Descrição do tipo (O UNIQUE será configurado no AppDbContext)
        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        // Um tipo de movimento é usado em vários movimentos
        public ICollection<Movimento> Movimentos { get; set; } = new List<Movimento>();
    }
}
