## abc2svg

**abc2svg** is a set of tools written in Javascript and based on
[abcm2ps](https://github.com/leesavide/abcm2ps).

It permits to edit, display, print and play music from files written in
[ABC](http://abcnotation.com/).

Its specific features are described (with abc2svg!) in the document
[abcm2ps/abc2svg features](http://moinejf.free.fr/abcm2ps-doc/features.xhtml)
and the parameters in
[abcm2ps/abc2svg parameters](http://moinejf.free.fr/abcm2ps-doc/index.html).

### Web usage

**abc2svg** may be used in any web browser.
The needed files are available in my site
[http://moinejf.free.fr/js/](http://moinejf.free.fr/js).  
They are updated on release change.

These files are:

- `abc2svg-1.js`   
  This script is the **abc2svg** core.  
  It contains the ABC parser and the SVG generation engine.  
  It must be included in the (X)HTML header of the pages
  where ABC rendering is needed (in `<script src=` tags).

- `abcemb-1.js`   
  This script is to be used with the core in (X)HTML files.  
  It replaces the ABC sequences by SVG images of the music
  (the ABC sequences start on `X:` or `%abc` at start of line,
  and stop on any ML tag).  
  See the
  [%%beginml documentation](http://moinejf.free.fr/abcm2ps-doc/beginml.xhtml)
  for an example.   
  When the URL of the (X)HTML file ends with '#' followed by a string,
  only the first tune containing this string is displayed.   
  Note that, if the ABC sequence contains the characters '<', '>' or '&',
  it must be enclosed in a XML comment (starting after the first `X:` or `%abc`).

- `abcemb1-1.js`   
  This script is also to be used with the core in (X)HTML files.  
  It works the same as the previous script, but displaying one tune only.
  When there is no selection ('#' + string at the end of the URL),
  a list of the tunes is proposed.   
  See [this tune](http://moinejf.free.fr/abc/boyvin-2-2.html)
  for an example.   

- `abcemb2-1.js`   
  This script is also to be used with the core in (X)HTML files.  
  The differences with the script `abcemb-1.js` are:
  - the ABC sequences are replaced in HTML elements with the class `abc`,
  - the string after '#' in the URL does a real %%select (i.e. this may
    select many tunes),
  - if the ABC sequences contain the characters '<', '>' or '&',
    either these sequences must be enclosed in a XML comment, or the characters
    must be replaced by their XML counterparts ('&amp;lt;', '&amp;gt;' or '&amp;amp;').
  
- `abcdoc-1.js`   
  This script is also to be used in (X)HTML pages with the core.  
  Mainly used for ABC documentation, it lets the ABC source sequences
  in the page before the SVG images.  
  See the source of
  [abcm2ps/abc2svg features](http://moinejf.free.fr/abcm2ps-doc/features.xhtml)
  for an example.

- `play-1.js`   
  This script may be used with `abcemb{,1,2}-1.js` for playing the
  rendered ABC music.  
  See [this page](http://moinejf.free.fr/abcm2ps-doc/au_clair.xhtml)
  for an example.

- `follow-1.js`   
  This script may be used after `play-1.js` for highlighting the notes
  while playing.   
  See [this page](http://moinejf.free.fr/abcm2ps-doc/tabac.xhtml)
  for an example.

- `edit-1.xhtml`   
  This is a simple web ABC editor/player.

When looking at a ABC file in a web browser, you may also use a
<a href="https://en.wikipedia.org/wiki/Bookmarklet">bookmarklet</a>
as
<a href="javascript:(function(){var%20s,n=3,d=document,b=d.body;b.innerHTML=%22\n%25abc-2.2\n%25%3c!--\n%22+b.textContent+%22%25--%3e\n%22;function%20f(u){s=d.createElement('script');s.src='http://moinejf.free.fr/js/'+u;s.onload=function(){if(--n==0)dom_loaded()};b.appendChild(s)};f('play-1.js');f('follow-1.js');f('abcemb-1.js')})();void(0)">this one</a>
for rendering all tunes, or
<a href="javascript:(function(){var%20s,n=3,d=document,b=d.body;b.innerHTML=%22\n%25abc-2.2\n%25%3c!--\n%22+b.textContent+%22%25--%3e\n%22;function%20f(u){s=d.createElement('script');s.src='http://moinejf.free.fr/js/'+u;s.onload=function(){if(--n==0)dom_loaded()};b.appendChild(s)};f('play-1.js');f('follow-1.js');f('abcemb1-1.js')})();void(0)">this one</a>
for rendering the tunes one by one.

##### Notes:
- The music is rendered as SVG images. There is one image per
  music line / text block.  
  If you want to move these images to some other files,
  each one must contain the full CSS and defs. For that, insert   
  `        %%fullsvg x`   
  in the ABC file before rendering (see the
  [fullsvg documentation](http://moinejf.free.fr/abcm2ps-doc/fullsvg.xhtml)
  for more information).

- Playing uses the HTML5 audio and/or midi APIs.

- With the editor, if you want to render ABC files
  which contain `%%abc-include`, you must:
  - load the ABC file from the browse button
  - click in the include file name
  - load the include file by the same browse button  

  Then, you may edit and save both files.  
  Rendering/playing is always done from the first ABC file.  
  There may be only one included file.

- The editor comes with different ways to enter the music from the keyboard.  
  If you have a US keyboard, you may try these bookmarklets:
<a href="javascript:(function(){if(typeof%20loadjs=='function'){loadjs('abckbd-1.js')}else{alert('use%20with%20abc2svg%20editor')}})();void(0)">keyboard 1</a>
and
<a href="javascript:(function(){if(typeof%20loadjs=='function'){loadjs('abckbd2-1.js')}else{alert('use%20with%20abc2svg%20editor')}})();void(0)">keyboard 2</a>

- The .js and .xhtml file names have a suffix which is the version of
  the core interface (actually '`-1`').

### nodeJS usage

Installed via **npm**, the **abc2svg** package comes with the
command line (batch) programs `abc2svg` and `abc2odt`.

These ones may be used as **abcm2ps** to generate XHTML or ODT files.   

`abc2svg` writes to standard output:   
`        abc2svg mytunes.abc > Out.xhtml`

`abc2odt` output is `abc.odt` or the file specified
by the command line argument `-o`:   
`        abc2odt my_file.abc -o my_file.odt`

### Build

If you want to build the **abc2svg** scripts in your machine,
you must first get the files from
[chisel](https://chiselapp.com/user/moinejf/repository/abc2svg),
either as a tarball or a Zip archive
(click `Timeline` and then in the top commit),
or by cloning the repository in some directory:

> `fossil clone https://chiselapp.com/user/moinejf/repository/abc2svg abc2svg.fossil`   
> `fossil open abc2svg.fossil`

Then, building is done using the tool [ninja](https://ninja-build.org/)
or [samurai](https://github.com/michaelforney/samurai).  
You may do it:

- without minification  
  This is interesting for debug purpose, the scripts being more human friendly.

  `        NOMIN=1 samu -v`

- in a standard way with minification  
  In this case, you need the tool `uglifyjs` which comes with nodeJS.

  `        samu -v`

If you also want to change or add music glyphs, you may edit the source
file `font/abc2svg.sfd`. In this case, you will need both `base64` and `fontforge`,
and run

`        samu -v font.js`

If you cannot or don't want to install `ninja` or `samurai`, you may build
the abc2svg files by `./build` which is a shell script.

### Batch

After building the **abc2svg** scripts, you will be able to generate music
sheets from the command line as you did with `abcm2ps`, thanks to the
following shell scripts (the result goes to stdout):  

- `abcjs24` with `js24` (Mozilla JavaScript shell - Spidermonkey)
- `abcjs52` with `js52` (Mozilla JavaScript shell - Spidermonkey)
- `abcjsc` with `jsc-1` (webkitgtk2)
- `abcnode` with `node` (nodeJS)
- `abcv8` with `d8` (Google libv8)

#### backend scripts

By default, the batch scripts generate (XHTML+SVG) files.   
This output may be modified by backend scripts. These ones must appear
just after the command.   
There are:

- `toabc.js`   
  This script outputs back the (selected) ABC tunes of the ABC source file.   
  Transposition is applied.   
  The resulting file does not contain the formatting parameters.   
  Example:   
  `        abcjs52 toabc.js my_file.abc --select X:2 > tune_2.abc`

- `toabw.js`   
  This script outputs a Abiword file (ABW+SVG) which may be read by some
  word processors (abiword, libreoffice...) and converted to many other
  formats by the batch function of abiword.   
  The abc2svg music font (`abc2svf.woff` or `abc2svg.ttf`) must be installed
  in the local system for displaying and/or converting the .abw file.   
  Example:   
  `        abcv8 toabw.js my_file.abc > my_file.abw`

- `toodt.js`   
  This script creates an Open Document (ODT+SVG) which may be read by most
  word processors (abiword, libreoffice...).   
  It runs only with the npm script `abc2svg` and asks for the npm module
  `jszip` to be installed.   
  The output ODT document may be specified by the command line argument `-o`
  (default `abc.odt`).   
  Example:   
  `        abc2svg toodt.js my_file.abc -o my_file.odt`

#### PDF generation

`abctopdf` is a shell script which converts ABC to PDF using one of the
previous shell scripts and the program `rsvg-convert`.   
As a constraint, the used music font must be installed and defined by
`%%musicfont <fontname>`.   
Example:   
`        abctopdf my_file.abc -o my_file.pdf`
