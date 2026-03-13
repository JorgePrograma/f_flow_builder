import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  LevelFormat,
  PageBreak,
  IBorderOptions,
  ITableCellBorders,
  ITableCellOptions,
} from "docx";
import { UserStory, StoryStatus, StoryRiskLevel } from "../../features/user-stories/domain/entities/UserStory";
import { Result, ok, fail } from "../../features/user-stories/domain/shared/Result";

const FIB_LABELS: Record<number, string> = {
  1: "Trivial",
  2: "Pequeño",
  3: "Mediano",
  4: "Mediano", // Para cubrir posibles desajustes
  5: "Grande",
  8: "Muy grande",
  13: "Épico",
  21: "Dividir HU",
};

const STATUS_LABELS: Record<string, string> = {
  [StoryStatus.TODO]: "Por hacer",
  [StoryStatus.PROGRESS]: "En progreso",
  [StoryStatus.DONE]: "Completada",
};

const RISK_COLORS: Record<string, string> = {
  [StoryRiskLevel.ALTO]: "C0392B",
  [StoryRiskLevel.MEDIO]: "E67E22",
  [StoryRiskLevel.BAJO]: "27AE60",
};

export class ExportService {
  static async exportStoriesToDocx(stories: UserStory[], filename: string): Promise<Result<void>> {
    try {
      const border: IBorderOptions = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
      const borders: ITableCellBorders = { top: border, bottom: border, left: border, right: border };
      const cellPad = { top: 80, bottom: 80, left: 120, right: 120 };

      const children: (Paragraph | Table | PageBreak)[] = [];

      // COVER
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 1440, after: 240 },
          children: [
            new TextRun({
              text: "Historias de Usuario",
              bold: true,
              size: 56,
              color: "1A365D",
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: `Estimación y Definición de Requerimientos`,
              size: 28,
              color: "4A5568",
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 1440 },
          children: [
            new TextRun({
              text: `Generado: ${new Date().toLocaleDateString("es-CO", {
                dateStyle: "long",
              })}`,
              size: 20,
              color: "718096",
            }),
          ],
        })
      );

      // SUMMARY
      const totalPts = stories.reduce((a, s) => a + (s.effort || 0), 0);
      children.push(this.sectionTitle("Resumen General", "1A365D"));
      children.push(
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({
              children: [
                this.summaryCell(`${stories.length}`, "Historias", "EBF4FF", "2B6CB0", borders, cellPad),
                this.summaryCell(`${totalPts}`, "Story Points", "F0FFF4", "276749", borders, cellPad),
                this.summaryCell(
                  `${stories.filter((s) => s.effort).length}`,
                  "Estimadas",
                  "FFF5F5",
                  "9B2C2C",
                  borders,
                  cellPad
                ),
              ],
            }),
          ],
        })
      );

      children.push(new Paragraph({ spacing: { after: 360 } }));

      // STORIES
      stories.forEach((s, i) => {
        if (i > 0) children.push(new PageBreak());

        children.push(
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: s.id, bold: true, size: 18, color: "718096" })],
          })
        );
        children.push(
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({ text: s.action || "Sin título", bold: true, size: 36, color: "1A365D" }),
            ],
          })
        );

        // Sentence
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            shading: { fill: "EBF4FF", type: ShadingType.CLEAR },
            border: {
              left: { style: BorderStyle.SINGLE, size: 12, color: "2B6CB0", space: 8 },
            },
            children: [
              new TextRun({ text: "Yo como ", bold: true, size: 20, color: "2B6CB0" }),
              new TextRun({ text: s.role || "—", size: 20, italics: true }),
              new TextRun({ text: ", quiero ", bold: true, size: 20, color: "2B6CB0" }),
              new TextRun({ text: s.action || "—", size: 20 }),
              new TextRun({ text: ", para ", bold: true, size: 20, color: "2B6CB0" }),
              new TextRun({ text: s.benefit || "—", size: 20, italics: true }),
              new TextRun({ text: ".", size: 20 }),
            ],
          })
        );
        children.push(new Paragraph({ spacing: { after: 120 } }));

        // Meta
        const statusLabel = STATUS_LABELS[s.status || StoryStatus.TODO];
        children.push(
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [4680, 2340, 2340],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    margins: cellPad,
                    children: [this.labelVal("Estado", statusLabel)],
                  }),
                  new TableCell({
                    borders,
                    margins: cellPad,
                    children: [this.labelVal("Story Points", s.effort ? String(s.effort) : "Sin estimar")],
                  }),
                  new TableCell({
                    borders,
                    margins: cellPad,
                    children: [this.labelVal("Complejidad", s.effort ? FIB_LABELS[s.effort] : "—")],
                  }),
                ],
              }),
            ],
          })
        );

        if (s.description) {
          children.push(this.sectionTitle("Descripción", "4A5568"));
          children.push(new Paragraph({ children: [new TextRun({ text: s.description, size: 20 })] }));
        }

        // Criteria
        children.push(this.sectionTitle("Criterios de Aceptación", "276749"));
        const crit = s.criteria.filter((c) => c);
        if (crit.length) crit.forEach((c) => children.push(this.bullet(c)));
        else
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Sin criterios definidos.", color: "718096", italics: true, size: 20 }),
              ],
            })
          );

        // Tasks
        children.push(this.sectionTitle("Tareas Técnicas", "744210"));
        if (s.tasks.length) {
          s.tasks.forEach((t) => {
            children.push(
              new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [
                  new TextRun({ text: `[${t.layer.toUpperCase()}] `, bold: true, size: 20 }),
                  new TextRun({ text: t.text || "—", size: 20 }),
                ],
              })
            );
          });
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Sin tareas definidas.", color: "718096", italics: true, size: 20 }),
              ],
            })
          );
        }

        // Risks
        children.push(this.sectionTitle("Riesgos y Bloqueos", "9B2C2C"));
        const risks = s.risks.filter((r) => r.text);
        if (risks.length) {
          risks.forEach((r) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `[${r.level.toUpperCase()}] `,
                    bold: true,
                    color: RISK_COLORS[r.level] || "718096",
                    size: 20,
                  }),
                  new TextRun({ text: r.text, size: 20 }),
                ],
              })
            );
          });
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Sin riesgos identificados.",
                  color: "718096",
                  italics: true,
                  size: 20,
                }),
              ],
            })
          );
        }
      });

      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "bullets",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "•",
                  alignment: AlignmentType.LEFT,
                  style: { paragraph: { indent: { left: 720, hanging: 360 } } },
                },
              ],
            },
          ],
        },
        // @ts-expect-error - PageBreak has different internal structure but is valid in children
        sections: [{ children }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      return ok(undefined);
    } catch (error) {
      return fail(error instanceof Error ? error : new Error("Error desconocido al exportar"));
    }
  }

  private static sectionTitle(text: string, color: string) {
    return new Paragraph({
      spacing: { before: 240, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color, space: 4 } },
      children: [new TextRun({ text, bold: true, size: 24, color })],
    });
  }

  private static summaryCell(
    val: string, 
    label: string, 
    fill: string, 
    color: string, 
    borders: ITableCellBorders, 
    cellPad: NonNullable<ITableCellOptions['margins']>
  ) {
    return new TableCell({
      borders,
      shading: { fill, type: ShadingType.CLEAR },
      margins: cellPad,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: val, bold: true, size: 48, color })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: label, size: 18, color: "4A5568" })],
        }),
      ],
    });
  }

  private static labelVal(label: string, val: string) {
    return new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 20 }),
        new TextRun({ text: val || "—", size: 20 }),
      ],
    });
  }

  private static bullet(text: string) {
    return new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      children: [new TextRun({ text, size: 20 })],
    });
  }
}
