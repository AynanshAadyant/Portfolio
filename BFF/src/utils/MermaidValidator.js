export class MermaidValidator {
  static VALID_PREFIXES = [
    'graph',
    'flowchart',
    'sequencediagram',
    'classdiagram',
    'statediagram',
    'statediagram-v2',
    'erdiagram',
    'journey',
    'gantt',
    'pie',
    'quadrantchart',
    'requirementdiagram',
    'gitgraph',
    'c4context',
    'mindmap',
    'timeline',
    'sankey-beta',
    'xychart-beta',
    'block-beta',
  ];

  /**
   * Validates whether a diagram string is valid Mermaid syntax.
   * @param {string} diagram
   * @returns {{ isValid: boolean, error?: string }}
   */
  static validate(diagram) {
    if (diagram === undefined || diagram === null || diagram === '') {
      // Empty diagram is allowed if optional
      return { isValid: true };
    }

    if (typeof diagram !== 'string') {
      return { isValid: false, error: 'Architecture diagram must be a string.' };
    }

    const trimmed = diagram.trim();
    if (!trimmed) {
      return { isValid: true };
    }

    // Check against dangerous script injections
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(trimmed) || /javascript:/i.test(trimmed)) {
      return { isValid: false, error: 'Architecture diagram contains unsafe script tags.' };
    }

    // First non-comment, non-empty line must start with a valid Mermaid keyword
    const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith('%%'));
    if (lines.length === 0) {
      return { isValid: true };
    }

    const firstWord = lines[0].split(/\s+/)[0].toLowerCase();
    const isMatched = MermaidValidator.VALID_PREFIXES.some((prefix) => firstWord.startsWith(prefix));

    if (!isMatched) {
      return {
        isValid: false,
        error: `Invalid Mermaid diagram syntax: Diagram must begin with a valid Mermaid diagram declaration (e.g. 'graph TD', 'graph LR', 'flowchart TD', 'sequenceDiagram'). Got: '${firstWord}'`,
      };
    }

    return { isValid: true };
  }

  /**
   * Sanitizes Mermaid diagram string.
   * @param {string} diagram
   * @returns {string}
   */
  static sanitize(diagram) {
    if (!diagram || typeof diagram !== 'string') return '';
    return diagram
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();
  }
}

export default MermaidValidator;
