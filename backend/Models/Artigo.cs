using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "artigo" na base de dados (Peças e Produtos)
    public class Artigo
    {
        // Chave Primária (PK) - Código único do artigo
        [Key]
        [MaxLength(255)]
        public string ArtigoCodigo { get; set; } = string.Empty;

        // Descrição ou nome do artigo
        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        // Unidade de medida (Ex: "UN", "KG")
        // Nota Dev: O documento especificava "integer", mas o ficheiro CSV contém strings ("UN"). 
        // Adaptei o modelo para "string" para suportar a importação correta dos dados do SAGE.
        [Required]
        [MaxLength(50)]
        public string Unidade { get; set; } = string.Empty;

        // Peso calculado em Kg
        [Required]
        public decimal Peso { get; set; } = 0;

        // Categoria técnica do artigo (Ex: "SACA") - Opcional
        [MaxLength(255)]
        public string? Categoria { get; set; }

        // Chave Estrangeira (FK) para Familia
        [Required]
        public int FamiliaId { get; set; }

        // Propriedade de Navegação para a tabela Familia
        [ForeignKey("FamiliaId")]
        public Familia? Familia { get; set; }

        // Coleção de propriedades técnicas PDM (ex: Material, Acabamento, etc.)
        public ICollection<Diversos> PropriedadesPDM { get; set; } = new List<Diversos>();

        // Chave Estrangeira (FK) para a máquina padrão associada ao fabrico
        [Required]
        [MaxLength(255)]
        public string MaquinaCodigo { get; set; } = string.Empty;

        // Propriedade de Navegação para a tabela Maquinas
        [ForeignKey("MaquinaCodigo")]
        public Maquina? Maquina { get; set; }

        // Relações com outras tabelas
        public ICollection<ArtigoCusto> HistoricoCustos { get; set; } = new List<ArtigoCusto>();
        public ICollection<DocumentoTecnico> Documentos { get; set; } = new List<DocumentoTecnico>();
        public ICollection<RececaoInspecao> Rececoes { get; set; } = new List<RececaoInspecao>();
    }
}
