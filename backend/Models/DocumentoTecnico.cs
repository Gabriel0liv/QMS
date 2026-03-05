using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Documento_tecnico" na base de dados
    public class DocumentoTecnico
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Chave Estrangeira (FK) para a tabela Artigo
        // O código da peça à qual este documento pertence
        [Required]
        [MaxLength(255)]
        public string ArtigoCodigo { get; set; } = string.Empty;

        // Propriedade de Navegação para Artigo (será criada a classe Artigo mais tarde)
        [ForeignKey("ArtigoCodigo")]
        public Artigo? Artigo { get; set; }

        // Tipo de documento (Ex: "Desenho Técnico", "Manual")
        [Required]
        [MaxLength(255)]
        public string TipoDocumento { get; set; } = string.Empty;

        // Caminho do ficheiro no servidor/disco
        // O UNIQUE para não repetir o mesmo ficheiro será garantido no AppDbContext
        [Required]
        [MaxLength(255)]
        public string CaminhoFicheiro { get; set; } = string.Empty;

        // Indica se é o documento oficial em vigor (true) ou um esboço/antigo (false)
        [Required]
        public bool IsOficial { get; set; } = false;

        // Um documento técnico pode ter várias assinaturas associadas a ele
        public ICollection<AssinaturaDocumento> Assinaturas { get; set; } = new List<AssinaturaDocumento>();
    }
}
