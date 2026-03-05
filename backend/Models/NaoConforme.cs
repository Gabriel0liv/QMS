using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Nao_conforme" (Registo principal de NC)
    public class NaoConforme
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Data em que o registo NC foi criado
        [Required]
        public DateTime DataRegisto { get; set; }

        // Quantidade registada no ERP SAGE. Se não houver correspondência, 0.
        [Required]
        public decimal QtdSage { get; set; } = 0;

        // Chave Estrangeira (FK) UNIQUE (Relação 1:1 com Movimentos)
        // Uma Não Conformidade pertence a apenas um Movimento específico no stock
        [Required]
        public int IdMovimento { get; set; }

        [ForeignKey("IdMovimento")]
        public Movimento? Movimento { get; set; }
    }
}
