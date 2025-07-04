// https://gist.github.com/rathoddeepak/347b0dd91617076433f3242efbbcddbd
declare module 'excel4node' {
  import { Stats } from 'fs';

  /**
   * An instance of the Worksheet class contains all information specific to that worksheet
   */
  export class Worksheet {
    /**
     * Accepts a validation options object with these available options. All options are optional with exception of sqref.
     */
    addDataValidation(opt: WorksheetValidation): void;
    /**
     * Conditional formatting adds custom formats in response to cell reference state. A subset of conditional formatting features is currently supported by excel4node.
     * Formatting rules apply at the worksheet level.
     */
    addConditionalFormattingRule(
      ref: string,
      opt: AddConditionalFormattingRuleOptions,
    ): void;

    column(number: number): Column;

    row(number: number): Row;

    /**
     * The cell method accesses a single cell or range of cells to manipulate cell method takes two required parameters and 3 optional parameters
     */
    cell(startRow: number, startColumn: number): Cell;
    cell(
      startRow: number,
      startColumn: number,
      endRow: number,
      endColumn: number,
    ): Cell;
    cell(
      startRow: number,
      startColumn: number,
      endRow: number,
      endColumn: number,
      isMerged: boolean,
    ): Cell;

    /**
     * Adds and image to the worksheet.
     */
    addImage(opt: AddImageOptions): void;
  }
  /**
   * An instance of the Workbook class contains all data and parameters for the Excel Workbook.
   */
  export class Workbook {
    constructor();
    constructor(opt: WorkbookOption);
    /**
     * Add Worksheets to the workbook. Accepts name of new WorkSheet and options object.
     */
    addWorksheet(sheet: string): Worksheet;
    addWorksheet(opts: WorksheetOption): Worksheet;
    addWorksheet(sheet: string, opts: WorksheetOption): Worksheet;

    /**
     * Sets which tab will be selected when the WorkBook is opened.Accepts Sheet ID (1-indexed sheet in order that sheets were added).
     */
    setSelectedTab(id: number): void;

    /**
     * Creates a new Style instance. Accepts Style configuration object. Returns a new Style instance.
     */
    createStyle(opts: Style): Style;

    /**
     * The write() method can accept a single filename, a filename with callback function or an HTTP response object.
     */
    write(filename: string): void;
    write(filename: string, callback: (err: any, stats: Stats) => void): void;

    /**
     * The writeToBuffer() method access no parameters and returns a promise that resolves with the nodebuffer generated by the JSZip library. This buffer can then be sent to other streams.
     */
    writeToBuffer(): Promise<Buffer>;
  }
  /**
   * Accepts cell reference (i.e. 'A1') and returns object with corresponding row and column. (i.e. returns { row: 5, col: 2})
   */
  export function getExcelRowCol(cellRef: string): {
    row: number;
    column: number;
  };

  /**
   * Accepts column as integer and returns corresponding column reference as alpha. (i.e. returns 'J')
   */
  export function getExcelAlpha(column: number): string;

  /**
   * Accepts row and column as integers and returns Excel cell reference. (i.e. returns 'C5')
   */
  export function getExcelCellRef(
    row: number,
    column: number,
  ): { row: number; column: number };

  /**
   * Accepts Date object and returns an Excel timestamp. (i.e. Returns 42004.791666666664)
   */
  export function getExcelTS(date: Date): number;

  interface WorkbookOption {
    jszip?: {
      /**
       * @default DEFLATE
       */
      compression: string;
    };
    defaultFont?: {
      /**
       * @default 12
       */
      size?: number;
      /**
       * @default Calibri
       */
      name?: string;
      /**
       * @default FFFFFFFF
       */
      color?: string;
    };
    /**
     * @default 'm/d/yy hh:mm:ss'
     */
    dateFormat?: string;
    workbookView?: {
      /**
       * Specifies an unsignedInt that contains the index to the active sheet in this book view.
       * @default 1
       */
      activeTab?: number;
      /**
       * Specifies a boolean value that indicates whether to group dates when presenting the user with filtering options in the user interface.
       * @default true
       */
      autoFilterDateGrouping?: boolean;
      /**
       * Specifies the index to the first sheet in this book view.
       * @default 1
       */
      firstSheet?: number;
      /**
       * Specifies a boolean value that indicates whether the workbook window is minimized.
       * @default false
       */
      minimized?: boolean;
      /**
       * Specifies a boolean value that indicates whether to display the horizontal scroll bar in the user interface.
       * @default true
       */
      showHorizontalScroll?: boolean;
      /**
       * Specifies a boolean value that indicates whether to display the sheet tabs in the user interface.
       * @default true
       */
      showSheetTabs?: boolean;
      /**
       * Specifies a boolean value that indicates whether to display the vertical scroll bar.
       * @default true
       */
      showVerticalScroll?: boolean;
      /**
       * Specifies ratio between the workbook tabs bar and the horizontal scroll bar.
       * @default 600
       */
      tabRatio?: number;
      /**
       * Specifies visible state of the workbook window. ('hidden', 'veryHidden', 'visible') (§18.18.89)
       * @default visible
       */
      visibility?: 'visible' | 'hidden' | 'veryHidden';
      /**
       * Specifies the height of the workbook window. The unit of measurement for this value is twips.
       * @default 17620
       */
      windowHeight?: number;
      /**
       * Specifies the width of the workbook window. The unit of measurement for this value is twips.
       * @default 28800
       */
      windowWidth?: number;
      /**
       * Specifies the X coordinate for the upper left corner of the workbook window. The unit of measurement for this value is twips.
       * @default 0
       */
      xWindow?: number;
      /**
       * Specifies the Y coordinate for the upper left corner of the workbook window. The unit of measurement for this value is twips.
       * @default 440
       */
      yWindow?: number;
    };
    /**
     * 0 - 5. 0 suppresses all logs, 1 shows errors only, 5 is for debugging
     * @default 0
     */
    logLevel?: 0 | 1 | 5;

    /**
     * Name for use in features such as comments
     * @default 'Microsoft Office User'
     */
    author?: string;
  }

  // ==================================
  // WORKSHEET
  // ==================================
  //#region

  type PaperSize =
    | 'LETTER_PAPER'
    | 'LETTER_SMALL_PAPER'
    | 'TABLOID_PAPER'
    | 'LEDGER_PAPER'
    | 'LEGAL_PAPER'
    | 'STATEMENT_PAPER'
    | 'EXECUTIVE_PAPER'
    | 'A3_PAPER'
    | 'A4_PAPER'
    | 'A4_SMALL_PAPER'
    | 'A5_PAPER'
    | 'B4_PAPER'
    | 'B5_PAPER'
    | 'FOLIO_PAPER'
    | 'QUARTO_PAPER'
    | 'STANDARD_PAPER_10_BY_14_IN'
    | 'STANDARD_PAPER_11_BY_17_IN'
    | 'NOTE_PAPER'
    | 'NUMBER_9_ENVELOPE'
    | 'NUMBER_10_ENVELOPE'
    | 'NUMBER_11_ENVELOPE'
    | 'NUMBER_12_ENVELOPE'
    | 'NUMBER_14_ENVELOPE'
    | 'C_PAPER'
    | 'D_PAPER'
    | 'E_PAPER'
    | 'DL_PAPER'
    | 'C5_ENVELOPE'
    | 'C3_ENVELOPE'
    | 'C4_ENVELOPE'
    | 'C6_ENVELOPE'
    | 'C65_ENVELOPE'
    | 'B4_ENVELOPE'
    | 'B5_ENVELOPE'
    | 'B6_ENVELOPE'
    | 'ITALY_ENVELOPE'
    | 'MONARCH_ENVELOPE'
    | 'SIX_THREE_QUARTERS_ENVELOPE'
    | 'US_STANDARD_FANFOLD'
    | 'GERMAN_STANDARD_FANFOLD'
    | 'GERMAN_LEGAL_FANFOLD'
    | 'ISO_B4'
    | 'JAPANESE_DOUBLE_POSTCARD'
    | 'STANDARD_PAPER_9_BY_11_IN'
    | 'STANDARD_PAPER_10_BY_11_IN'
    | 'STANDARD_PAPER_15_BY_11_IN'
    | 'INVITE_ENVELOPE'
    | 'LETTER_EXTRA_PAPER'
    | 'LEGAL_EXTRA_PAPER'
    | 'TABLOID_EXTRA_PAPER'
    | 'A4_EXTRA_PAPER'
    | 'LETTER_TRANSVERSE_PAPER'
    | 'A4_TRANSVERSE_PAPER'
    | 'LETTER_EXTRA_TRANSVERSE_PAPER'
    | 'SUPER_A_SUPER_A_A4_PAPER'
    | 'SUPER_B_SUPER_B_A3_PAPER'
    | 'LETTER_PLUS_PAPER'
    | 'A4_PLUS_PAPER'
    | 'A5_TRANSVERSE_PAPER'
    | 'JIS_B5_TRANSVERSE_PAPER'
    | 'A3_EXTRA_PAPER'
    | 'A5_EXTRA_PAPER'
    | 'ISO_B5_EXTRA_PAPER'
    | 'A2_PAPER'
    | 'A3_TRANSVERSE_PAPER'
    | 'A3_EXTRA_TRANSVERSE_PAPER';

  interface WorksheetOption {
    /**
     * Accepts a Double in Inches
     */
    margins?: {
      bottom?: number;
      footer?: number;
      header?: number;
      left?: number;
      right?: number;
      top?: number;
    };
    printOptions?: {
      centerHorizontal?: boolean;
      centerVertical?: boolean;
      printGridLines?: boolean;
      printHeadings?: boolean;
    };
    /**
     * Set Header and Footer strings and options.
     */
    headerFooter?: {
      evenFooter?: string;
      evenHeader?: string;
      firstFooter?: string;
      firstHeader?: string;
      oddFooter?: string;
      oddHeader?: string;
      alignWithMargins?: boolean;
      differentFirst?: boolean;
      differentOddEven?: boolean;
      scaleWithDoc?: boolean;
    };
    pageSetup?: {
      blackAndWhite?: boolean;
      /**
       *one of 'none', 'asDisplayed', 'atEnd'
       */
      cellComments?: 'none' | 'asDisplayed' | 'atEnd';
      copies?: number;
      draft?: boolean;
      /**
       * One of 'displayed', 'blank', 'dash', 'NA'
       */
      errors?: 'displayed' | 'blank' | 'dash' | 'NA';
      firstPageNumber?: number;
      /**
       * Number of vertical pages to fit to
       */
      fitToHeight?: number;
      /**
       * Number of horizontal pages to fit to
       */
      fitToWidth?: number;
      horizontalDpi?: number;
      /**
       * One of 'default', 'portrait', 'landscape'
       */
      orientation?: 'default' | 'portrait' | 'landscape';
      /**
       * One of 'downThenOver', 'overThenDown'
       */
      pageOrder?: 'downThenOver' | 'overThenDown';
      /**
       * Value must a positive Float immediately followed by unit of measure from list mm, cm, in, pt, pc, pi. i.e. '10.5cm'
       */
      paperHeight?: string;
      /**
       * see lib/types/paperSize.js for all types and descriptions of types. setting paperSize overrides paperHeight and paperWidth settings
       */
      paperSize?: PaperSize;
      /**
       * Value must a positive Float immediately followed by unit of measure from list mm, cm, in, pt, pc, pi. i.e. '10.5cm'
       */
      paperWidth?: string;
      scale?: number;
      useFirstPageNumber?: boolean;
      usePrinterDefaults?: boolean;
      verticalDpi?: number;
    };
    sheetView?: {
      /**
       * Note. Calling .freeze() on a row or column will adjust these values
       */
      pane?: {
        /**
         * one of 'bottomLeft', 'bottomRight', 'topLeft', 'topRight'
         */
        activePane?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
        /**
         *  one of 'split', 'frozen', 'frozenSplit'
         */
        state?: 'split' | 'frozen' | 'frozenSplit';
        /**
         * Cell Reference, i.e. 'A1'
         */
        topLeftCell?: string;
        /**
         * Horizontal position of the split, in 1/20th of a point; 0 (zero) if none. If the pane is frozen, this value indicates the number of columns visible in the top pane.
         */
        xSplit?: number;
        /**
         * Vertical position of the split, in 1/20th of a point; 0 (zero) if none. If the pane is frozen, this value indicates the number of rows visible in the left pane.
         */
        ySplit?: number;
      };
      /**
       * Flag indicating whether the sheet is in 'right to left' display mode. When in this mode, Column A is on the far right, Column B ;is one column left of Column A, and so on. Also, information in cells is displayed in the Right to Left format.
       */
      rightToLeft?: boolean;
      /**
       * Flag indicating whether the sheet should have gridlines enabled or disabled during view
       */
      showGridLines?: boolean;
      /**
       * Defaults to 100
       */
      zoomScale?: number;
      /**
       * Defaults to 100
       */
      zoomScaleNormal?: number;
      /**
       * Defaults to 100
       */
      zoomScalePageLayoutView?: number;
    };
    sheetFormat?: {
      /**
       * Defaults to 10. Specifies the number of characters of the maximum digit width of the normal style's font. This value does not include margin padding or extra padding for gridlines. It is only the number of characters.,
       */
      baseColWidth?: number;
      defaultColWidth?: number;
      defaultRowHeight?: number;
      /**
       *  'True' if rows have a thick bottom border by default.
       */
      thickBottom?: boolean;
      /**
       * 'True' if rows have a thick top border by default.
       */
      thickTop?: boolean;
    };
    /**
     * same as "Protect Sheet" in Review tab of Excel
     */
    sheetProtection?: {
      /**
       * True means that that user will be unable to modify this setting
       */
      autoFilter?: boolean;
      deleteColumns?: boolean;
      deleteRows?: boolean;
      formatCells?: boolean;
      formatColumns?: boolean;
      formatRows?: boolean;
      insertColumns?: boolean;
      insertHyperlinks?: boolean;
      insertRows?: boolean;
      objects?: boolean;
      password?: string;
      pivotTables?: boolean;
      scenarios?: boolean;
      selectLockedCells?: boolean;
      selectUnlockedCells?: boolean;
      sheet?: boolean;
      sort?: boolean;
    };
    outline?: {
      /**
       *  Flag indicating whether summary rows appear below detail in an outline, when applying an outline/grouping.
       */
      summaryBelow?: boolean;
      /**
       *   Flag indicating whether summary columns appear to the right of detail in an outline, when applying an outline/grouping.
       */
      summaryRight?: boolean;
    };
    /**
     *   Flag indicating whether to remove the "spans" attribute on row definitions. Including spans in an optimization for Excel file readers but is not necessary
     */
    disableRowSpansOptimization?: boolean;
  }

  interface WorksheetValidation {
    /**
     * Required. Specifies range of cells to apply validate. i.e. "A1:A100"
     */
    sqref: string;
    /**
     * Allows cells to be empty
     */
    allowBlank?: boolean;
    /**
     * One of 'stop', 'warning', 'information'. You must specify an error string for this to take effect
     */
    errorStyle?: 'stop' | 'warning' | 'information';
    /**
     * Message to show on error
     */
    error?: string;
    /**
     * Title of message shown on error
     */
    errorTitle?: string;
    /**
     * Defaults to true if error or errorTitle is set
     */
    showErrorMessage?: boolean;
    /**
     * Restricts input to a specific set of characters. One of 'noControl', 'off', 'on', 'disabled', 'hiragana', 'fullKatakana', 'halfKatakana', 'fullAlpha', 'halfAlpha', 'fullHangul', 'halfHangul'
     */
    imeMode?:
      | 'noControl'
      | 'off'
      | 'on'
      | 'disabled'
      | 'hiragana'
      | 'fullKatakana'
      | 'halfKatakana'
      | 'fullAlpha'
      | 'halfAlpha'
      | 'fullHangul'
      | 'halfHangul';
    /**
     * Must be one of 'between', 'notBetween', 'equal', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'
     */
    operator?:
      | 'between'
      | 'notBetween'
      | 'equal'
      | 'notEqual'
      | 'lessThan'
      | 'lessThanOrEqual'
      | 'greaterThan'
      | 'greaterThanOrEqual';
    /**
     * Message text of input prompt
     */
    prompt?: string;
    /**
     * Title of input prompt
     */
    promptTitle?: string;
    /**
     * Defaults to true if prompt or promptTitle is set
     */
    showInputMessage?: boolean;
    /**
     * A boolean value indicating whether to display a dropdown combo box for a list type data validation. Defaults to true for type:list
     */
    showDropDown?: boolean;
    /**
     * One of 'none', 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom'
     */
    type?: string;
    /**
     * Minimum count 1, maximum count 2.
     */
    formulas?: any[];
  }

  interface AddConditionalFormattingRuleOptions {
    type?: string;
    priority?: number;
    formula?: string;
    style?: Style;
  }

  interface AddImageOptions {
    image?: Buffer;
    name?: string;
    path?: string;
    type?: string | 'picture';
    /**
     * absoluteAnchor takes two position elements in either EMUs or measurements in cm, mm, or in
     * x:0, y:0 is top left corner of worksheet.
     * oneCellAnchor and twoCellAnchor types will take positional objects
     */
    position?: {
      type: 'absoluteAnchor' | 'oneCellAnchor' | 'twoCellAnchor';
      x?: number | string;
      y?: number | string;
      from?: {
        col?: number | string;
        colOff?: number | string;
        row?: number | string;
        rowOff?: number | string;
      };
      to?: {
        col?: number | string;
        colOff?: number | string;
        row?: number | string;
        rowOff?: number | string;
      };
    };
  }
  //#endregion

  // ==================================
  // ROWS AND COLUMNS
  // ==================================
  //#region
  interface RowColumnBase {
    /**
     * Set rows and/or columns to create a frozen pane with an optionall scrollTo
     */
    freeze(): RowColumnBase;
    freeze(number: number): RowColumnBase; // Freezes the first two columns and scrolls the right view to column
    /**
     * Add Filters to a row If not options are given to the filter function, a filter will be added to all columns that contain data. Optionally, if you wish to restrict your filter to a specific range, you can specify start and end rows and columns for that range. The filter row should be included in this range.
     */
    filter(): RowColumnBase;
    filter(opt: {
      firstRow?: number;
      firstColumn?: number;
      lastRow?: number;
      lastColumn?: number;
    }): RowColumnBase;

    /**
     * Hide a row or column
     */
    hide(): RowColumnBase;

    /**
     * Create groupings of rows or columns and optionally state to collapse the grouping
     */
    group(number: number): RowColumnBase;
    group(number: number, collapse: boolean): RowColumnBase;
  }

  interface Column extends RowColumnBase {
    setWidth(number: number): RowColumnBase;
  }

  interface Row extends RowColumnBase {
    setHeight(number: number): RowColumnBase;
  }
  //#endregion

  // ==================================
  // CELLS
  // ==================================
  //#region
  interface Cell {
    /**
     * accepts a String or Array. Sending array allows for multiple font formattings within the same cell.
     */
    string(arg: string | any[]): Cell;
    /**
     * accepts a number
     */
    number(arg: number): Cell;
    /**
     * accepts an Excel formula
     */
    formula(arg: string): Cell;
    /**
     * accepts either a date or a date string
     */
    date(arg: string | Date): Cell;
    /**
     * accepts a URL and optionally a displayStr and hover tooltip
     */
    link(arg: string): Cell;
    /**
     * accepts a boolean (true or false)
     */
    bool(arg: boolean): Cell;
    /**
     * accepts the same object as when creating a new style. When applied to a cell that already has style formatting, the original formatting will be kept and updated with the changes sent to the style function.
     */
    style(arg: Style): Cell;
  }
  //#endregion

  // ==================================
  // STYLES
  // ==================================
  //#region
  // prettier-ignore
  /**
   * §18.18.3 ST_BorderStyle (Border Line Styles)
   */
  type BorderStyle =  'none'| 'thin'| 'medium'| 'dashed'| 'dotted'| 'thick'| 'double'| 'hair'| 'mediumDashed'| 'dashDot'| 'mediumDashDot'| 'dashDotDot'| 'mediumDashDotDot'| 'slantDashDot';

  interface Style {
    /**
     *  §18.8.1
     */
    alignment?: {
      horizontal?:
        | 'center'
        | 'centerContinuous'
        | 'distributed'
        | 'fill'
        | 'general'
        | 'justify'
        | 'left'
        | 'right';
      /**
       * Number of spaces to indent = indent value * 3
       */
      indent?: number;
      justifyLastLine?: boolean;
      readingOrder?: 'contextDependent' | 'leftToRight' | 'rightToLeft';
      /**
       * number of additional spaces to indent
       */
      relativeIndent?: number;
      shrinkToFit?: boolean;
      /**
       * number of degrees to rotate text counter-clockwise
       */
      textRotation?: number;
      vertical?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top';
      wrapText?: boolean;
    };
    /**
     * §18.8.22
     */
    font?: {
      bold?: boolean;
      charset?: number;
      color?: string;
      condense?: boolean;
      extend?: boolean;
      family?: string;
      italics?: boolean;
      name?: string;
      outline?: boolean;
      /**
       * §18.18.33 ST_FontScheme (Font scheme Styles)
       */
      scheme?: string;
      shadow?: boolean;
      strike?: boolean;
      size?: number;
      underline?: boolean;
      /**
       * §22.9.2.17 ST_VerticalAlignRun (Vertical Positioning Location)
       */
      vertAlign?: string;
    };
    /**
     * §18.8.4 border (Border)
     */
    border?: {
      left?: {
        style?: BorderStyle;
        color?: string;
      };
      right?: {
        style?: BorderStyle;
        color?: string;
      };
      top?: {
        style?: BorderStyle;
        color?: string;
      };
      bottom?: {
        style?: BorderStyle;
        color?: string;
      };
      diagonal?: {
        style?: BorderStyle;
        color?: string;
      };
      diagonalDown?: boolean;
      diagonalUp?: boolean;
      outline?: boolean;
    };
    /**
     * §18.8.20 fill (Fill)
     */
    fill?: {
      /**
       * Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
       */
      type?: string;
      /**
       * §18.18.55 ST_PatternType (Pattern Type)
       */
      patternType?: string;
      /**
       * HTML style hex value. defaults to black
       */
      bgColor?: string;
      /**
       * HTML style hex value. defaults to black.
       */
      fgColor?: string;
    };
    /**
     * §18.8.30 numFmt (Number Format)
     */
    numberFormat?: number | string;
  }
  //#endregion
}
