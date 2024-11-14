// Add at the top of the file:
const getFontList = async () => {
  if ('queryLocalFonts' in window) {
    try {
      const fonts = await (window as any).queryLocalFonts();
      return [...new Set(fonts.map((font: any) => font.family))];
    } catch (error) {
      console.warn('Could not query local fonts:', error);
    }
  }
  return [
    'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New',
    'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond',
    'Bookman', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
    'Open Sans', 'Roboto', 'Lato', 'Montserrat', 'Source Sans Pro',
    'Noto Sans', 'Ubuntu', 'Merriweather', 'Playfair Display'
  ];
};

// Then in the component:
const [availableFonts, setAvailableFonts] = useState<string[]>([]);

useEffect(() => {
  getFontList().then(setAvailableFonts);
}, []);

// Replace the font selection dropdown with:
<select
  value={fontFamily}
  onChange={(e) => setFontFamily(e.target.value)}
  className="w-full p-2 border rounded"
>
  {availableFonts.map((font) => (
    <option key={font} value={font} style={{ fontFamily: font }}>
      {font}
    </option>
  ))}
</select>

// Add CSS for superscript:
const handleSuperscript = (text: string) => {
  return text.replace(/[®™]/g, (match) => `<sup style="font-size: 0.6em">${match}</sup>`);
};

// Update the text display:
<div
  style={{
    fontSize: element.fontSize,
    color: element.color,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight,
    textDecoration: element.textDecoration,
    fontStyle: element.fontStyle,
    textAlign: element.textAlign,
  }}
  className="whitespace-pre-wrap"
  dangerouslySetInnerHTML={{ __html: handleSuperscript(element.content) }}
/>