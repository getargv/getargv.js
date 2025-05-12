type utf_8          = "unicode-1-1-utf-8" | "unicode11utf8" | "unicode20utf8" | "utf-8" | "utf8" | "x-unicode20utf8";
type ibm866         = "866" | "cp866" | "csibm866" | "ibm866";
type iso_8859_2     = "csisolatin2" | "iso-8859-2" | "iso-ir-101" | "iso8859-2" | "iso88592" | "iso_8859-2" | "iso_8859-2:1987" | "l2"|  "latin2";
type iso_8859_3     = "csisolatin3" | "iso-8859-3" | "iso-ir-109" | "iso8859-3" | "iso88593" | "iso_8859-3" | "iso_8859-3:1988" | "l3" | "latin3";
type iso_8859_4     = "csisolatin4" | "iso-8859-4" | "iso-ir-110" | "iso8859-4" | "iso88594" | "iso_8859-4" | "iso_8859-4:1988" | "l4" | "latin4";
type iso_8859_5     = "csisolatincyrillic" | "cyrillic" | "iso-8859-5" | "iso-ir-144" | "iso8859-5" | "iso88595" | "iso_8859-5" | "iso_8859-5:1988";
type iso_8859_6     = "arabic" | "asmo-708" | "csiso88596e" | "csiso88596i" | "csisolatinarabic" | "ecma-114" | "iso-8859-6" | "iso-8859-6-e" | "iso-8859-6-i" | "iso-ir-127" | "iso8859-6" | "iso88596" | "iso_8859-6" | "iso_8859-6:1987";
type iso_8859_7     = "csisolatingreek" | "ecma-118" | "elot_928" | "greek" | "greek8" | "iso-8859-7" | "iso-ir-126" | "iso8859-7" | "iso88597" | "iso_8859-7" | "iso_8859-7:1987" | "sun_eu_greek";
type iso_8859_8     = "csiso88598e" | "csisolatinhebrew" | "hebrew" | "iso-8859-8" | "iso-8859-8-e" | "iso-ir-138" | "iso8859-8" | "iso88598" | "iso_8859-8" | "iso_8859-8:1988" | "visual";
type iso_8859_8_i   = "csiso88598i" | "iso-8859-8-i" | "logical";
type iso_8859_10    = "csisolatin6" | "iso-8859-10" | "iso-ir-157" | "iso8859-10" | "iso885910" | "l6" | "latin6";
type iso_8859_13    = "iso-8859-13" | "iso8859-13" | "iso885913";
type iso_8859_14    = "iso-8859-14" | "iso8859-14" | "iso885914";
type iso_8859_15    = "csisolatin9" | "iso-8859-15" | "iso8859-15" | "iso885915" | "iso_8859-15" | "latin9" | "l9"; // latin9 only in mdn
type iso_8859_16    = "iso-8859-16";
type koi8_r         = "cskoi8r" | "koi" | "koi8" | "koi8-r" | "koi8_r";
type koi8_u         = "koi8-ru" | "koi8-u";
type macintosh      = "csmacintosh" | "mac" | "macintosh" | "x-mac-roman";
type windows_874    = "dos-874" | "iso-8859-11" | "iso8859-11" | "iso885911" | "tis-620" | "windows-874";
type windows_1250   = "cp1250" | "windows-1250" | "x-cp1250";
type windows_1251   = "cp1251" | "windows-1251" | "x-cp1251";
type windows_1252   = "ansi_x3.4-1968" | "ascii" | "cp1252" | "cp819" | "csisolatin1" | "ibm819" | "iso-8859-1" | "iso-ir-100" | "iso8859-1" | "iso88591" | "iso_8859-1" | "iso_8859-1:1987" | "l1" | "latin1" | "us-ascii" | "windows-1252" | "x-cp1252";
type windows_1253   = "cp1253" | "windows-1253" | "x-cp1253";
type windows_1254   = "cp1254" | "csisolatin5" | "iso-8859-9" | "iso-ir-148" | "iso8859-9" | "iso88599" | "iso_8859-9" | "iso_8859-9:1989" | "l5" | "latin5" | "windows-1254" | "x-cp1254";
type windows_1255   = "cp1255" | "windows-1255" | "x-cp1255";
type windows_1256   = "cp1256" | "windows-1256" | "x-cp1256";
type windows_1257   = "cp1257" | "windows-1257" | "x-cp1257";
type windows_1258   = "cp1258" | "windows-1258" | "x-cp1258";
type x_mac_cyrillic = "x-mac-cyrillic" | "x-mac-ukrainian";
type gbk            = "chinese" | "csgb2312" | "csiso58gb231280" | "gb2312" | "gb_2312" | "gb_2312-80" | "gbk" | "iso-ir-58" | "x-gbk";
type gb18030        = "gb18030";
type big5           = "big5" | "big5-hkscs" | "cn-big5" | "csbig5" | "x-x-big5";
type euc_jp         = "cseucpkdfmtjapanese" | "euc-jp" | "x-euc-jp";
type iso_2022_jp    = "csiso2022jp" | "iso-2022-jp";
type shift_jis      = "csshiftjis" | "ms932" | "ms_kanji" | "shift-jis" | "shift_jis" | "sjis" | "windows-31j" | "x-sjis";
type euc_kr         = "cseuckr" | "csksc56011987" | "euc-kr" | "iso-ir-149" | "korean" | "ks_c_5601-1987" | "ks_c_5601-1989" | "ksc5601" | "ksc_5601" | "windows-949";
type replacement    = "csiso2022kr" | "hz-gb-2312" | "iso-2022-cn" | "iso-2022-cn-ext" | "iso-2022-kr" | "replacement";
type utf_16be       = "unicodefffe" | "utf-16be";
type utf_16le       = "csunicode" | "iso-10646-ucs-2" | "ucs-2" | "unicode" | "unicodefeff" | "utf-16" | "utf-16le";
type x_user_defined = "x-user-defined";

//export type TextEncoding = utf_8 | ibm866 | iso_8859_2 | iso_8859_3 | iso_8859_4 | iso_8859_5 | iso_8859_6 | iso_8859_7 | iso_8859_8 | iso_8859_8_i | iso_8859_10 | iso_8859_13 | iso_8859_14 | iso_8859_15 | iso_8859_16 | koi8_r | koi8_u | macintosh | windows_874 | windows_1250 | windows_1251 | windows_1252 | windows_1253 | windows_1254 | windows_1255 | windows_1256 | windows_1257 | windows_1258 | x_mac_cyrillic | gbk | gb18030 | big5 | euc_jp | iso_2022_jp | shift_jis | euc_kr | utf_16be | utf_16le | x_user_defined | replacement;

export type TextEncoding = ConstructorParameters<typeof TextDecoder>[0];
export type TextDecoderOptions = ConstructorParameters<typeof TextDecoder>[1];

export interface GetArgv {

    /** @constant
      * @description the maximum value a pid may have on the system
      */
    readonly PID_MAX: number;

    /** @constant
      * @description the maximum number of bytes that can be passed as args to a process (including env vars, etc)
      */
    readonly ARG_MAX: number;

    /**
     * Gets the arguments of a process as an ArrayBuffer
     * @param pid - The pid of the process whose arguments you want, must be between 0..{@link PID_MAX} inclusive.
     * @param nuls - Whether to replace nul bytes with spaces for human consumption.
     * @param skip - The number of leading args to skip past.
     * @returns An ArrayBuffer representing the arguments of pid, formatted as requested.
     * @throws {@link TypeError} if called with: missing pid argument, invalid number as pid, invalid number as skip.
     * @throws {@link RangeError} if called with pid outside valid range: 0..{@link PID_MAX} inclusive.
     * @throws {@link SystemError} if the underlying sysctl or parsing fails.
     */
    get_argv_of_pid(pid: number, nuls: boolean, skip: number): ArrayBuffer

    /**
     * Gets the arguments of a process as a string
     * @param pid - The pid of the process whose arguments you want, must be between 0..{@link PID_MAX} inclusive.
     * @param encoding - The encoding to attempt to apply to the arguments. Must be an enumerated value of {@link TextEncoding}.
     * @param nuls - Whether to replace nul bytes with spaces for human consumption.
     * @param skip - The number of leading args to skip past.
     * @param options - The options to use when decoding the process' arguments' bytes into a string.
     * @returns A string representing the arguments of pid, formatted as requested.
     * @throws {@link TypeError} if called with: missing pid, missing encoding argument, invalid number as pid, invalid number as skip, or if `options.fatal` is true and it encounters malformed data while decoding.
     * @throws {@link RangeError} if called with invalid encoding argument or pid outside valid range: 0..{@link PID_MAX} inclusive.
     * @throws {@link SystemError} if the underlying sysctl or parsing fails.
     */
    as_string(pid: number, encoding: TextEncoding, nuls?: boolean, skip?: number, options?: TextDecoderOptions): string

    /**
     * Gets the arguments of a process as an array of ArrayBuffers
     * @param pid - The pid of the process whose arguments you want, must be between 0..{@link PID_MAX} inclusive.
     * @returns An array of ArrayBuffers representing the arguments of pid.
     * @throws {@link TypeError} if called with: missing pid, too many arguments, invalid number as pid.
     * @throws {@link RangeError} if called with pid outside valid range: 0..{@link PID_MAX} inclusive.
     * @throws {@link SystemError} if the underlying sysctl or parsing fails.
     */
    get_argv_and_argc_of_pid(pid: number): Array<ArrayBuffer>

    /**
     * Gets the arguments of a process as an array of strings
     * @param pid - The pid of the process whose arguments you want, must be between 0..{@link PID_MAX} inclusive.
     * @param encoding - The encoding to attempt to apply to the arguments. Must be an enumerated value of {@link TextEncoding}.
     * @param options - The options to use when decoding the process' arguments' bytes into strings.
     * @returns An array of strings representing the arguments of pid.
     * @throws {@link TypeError} if called with: missing pid, missing encoding argument, too many arguments, invalid number as pid, or if `options.fatal` is true and it encounters malformed data while decoding.
     * @throws {@link RangeError} if called with: invalid encoding argument, pid outside valid range: 0..{@link PID_MAX} inclusive.
     * @throws {@link SystemError} if the underlying sysctl or parsing fails.
     */
    as_array(pid: number, encoding: TextEncoding, options?: TextDecoderOptions): Array<string>
}
