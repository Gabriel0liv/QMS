using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Retrabalho" (Registo de horas gastas a corrigir peças)
    public class Retrabalho
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Setor que identificou a necessidade de retrabalho
        [Required]
        [MaxLength(255)]
        public string SetorIdentificado { get; set; } = string.Empty;

        // Ação corretiva a executar
        [Required]
        [MaxLength(255)]
        public string AcaoExecutar { get; set; } = string.Empty;

        // Data do retrabalho
        [Required]
        public DateTime DataRetrabalho { get; set; }

        // Tempo despendido em minutos
        [Required]
        public decimal TempoMinutos { get; set; }

        // Custos calculados à posteriori (opcionais na altura do registo base)
        public decimal? CustoRetrabalho { get; set; }
        public decimal? CustoRejeicao { get; set; }
        public decimal? CustoNc { get; set; }

        // Chave Estrangeira (FK) -> Maquina onde a rejeição/erro aconteceu
        [Required]
        [MaxLength(255)]
        public string MaquinaRejeicao { get; set; } = string.Empty;

        [ForeignKey("MaquinaRejeicao")]
        public Maquina? Maquina { get; set; }

        // Chave Estrangeira (FK) UNIQUE (Relação 1:1 com Movimentos)
        // Um Retrabalho pertence a apenas um Movimento
        [Required]
        public int IdMovimento { get; set; }

        [ForeignKey("IdMovimento")]
        public Movimento? Movimento { get; set; }
    }
}
