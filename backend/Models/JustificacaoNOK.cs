using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Justificacao_NOK" (Motivos pelos quais peças reprovaram na inspeção de receção)
    public class JustificacaoNOK
    {
        // Chave Primária
        [Key]
        public int Id { get; set; }

        // Quantidade específica de peças afetadas por este defeito
        [Required]
        public decimal QtdAfetada { get; set; }

        // Notas detalhadas do inspetor (opcional)
        [MaxLength(255)]
        public string? Observacoes { get; set; }

        // Chave Estrangeira (FK) -> Receção onde isto foi inspecionado
        [Required]
        public int RececaoId { get; set; }

        [ForeignKey("RececaoId")]
        public RececaoInspecao? Rececao { get; set; }

        // Chave Estrangeira (FK) -> Tipo de defeito retirado do catálogo
        [Required]
        public int DefeitoId { get; set; }

        [ForeignKey("DefeitoId")]
        public CatalogoDefeito? Defeito { get; set; }
    }
}
