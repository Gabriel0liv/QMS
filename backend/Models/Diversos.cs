using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "diversos" — propriedades técnicas extras do artigo vindas do PDM (SolidWorks)
    // Cada linha é uma propriedade de um artigo (ex: Material, Acabamento, Norma, etc.)
    public class Diversos
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Chave Estrangeira (FK) para o Artigo a que pertence
        [Required]
        [MaxLength(255)]
        public string ArtigoCodigo { get; set; } = string.Empty;

        [ForeignKey("ArtigoCodigo")]
        public Artigo? Artigo { get; set; }

        // Nome da propriedade PDM (ex: "Material", "Acabamento_Superficie", "Norma")
        [Required]
        [MaxLength(255)]
        public string Propriedade { get; set; } = string.Empty;

        // Valor da propriedade (ex: "Alumínio 6060", "Lacado RAL 9010", "EN 755-9")
        [Required]
        [MaxLength(500)]
        public string Valor { get; set; } = string.Empty;
    }
}
