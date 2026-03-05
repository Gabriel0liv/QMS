using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    // Representa a tabela "Maquinas" na base de dados
    public class Maquina
    {
        // Chave Primária (PK) - Código da máquina (Ex: "AE01")
        [Key]
        [MaxLength(255)]
        public string MaquinaCodigo { get; set; } = string.Empty;

        // Descrição / Nome da máquina
        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        // Estado da máquina (true = ativo, false = inativo)
        [Required]
        public bool Estado { get; set; } = true;

        // Preço padrão de usinagem. Se não houver, assume 0.
        [Required]
        public decimal PrecoUsinagem { get; set; } = 0;

        // Preço padrão de mão de obra. Se não houver, assume 0.
        [Required]
        public decimal PrecoMaoObra { get; set; } = 0;

        // Preço padrão de energia. Se não houver, assume 0.
        [Required]
        public decimal PrecoEnergia { get; set; } = 0;

        // Código do setor onde a máquina está inserida (opcional)
        // Nota: O doc original diz Integer, mas se houver setores como "15APA" será preciso confirmar. Mantemos int conforme doc.
        public int? Setor { get; set; }

        // Uma máquina é referenciada em muitos Artigos, Movimentos e Retrabalhos
        public ICollection<Artigo> Artigos { get; set; } = new List<Artigo>();
    }
}
