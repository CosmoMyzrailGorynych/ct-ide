
riot.tag2('license-notice', '<div class="panel"><i class="icon-{closed? \'reveal\' : \'collapse\'}" onclick="{toggleClose}"></i> <h2>{opts.name}</h2> <pre class="nicecode" if="{!closed}"><code></code></pre> </div>', '', '', function(opts) {
    this.closed = true;
    this.toggleClose = e => {
        this.closed = !this.closed;
    };

});
riot.tag2('authors-panel', '<license-notice name="alertify.js (alertifyjs.org)"> The MIT License =============== Copyright (c) 2009-2014 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. </license-notice> <license-notice name="color.js"> Copyright (c) 2008-2010, Andrew Brehaut, Tim Baumann, Matt Wilson All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. </license-notice> <license-notice name="Lato Font by Łukasz Dziedzic"> Copyright (c) 2010-2015, Łukasz Dziedzic (dziedzic@typoland.com), with Reserved Font Name Lato. This Font Software is licensed under the SIL Open Font License, Version 1.1. This license is copied below, and is also available with a FAQ at: http://scripts.sil.org/OFL ----------------------------------------------------------- SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007 ----------------------------------------------------------- PREAMBLE The goals of the Open Font License (OFL) are to stimulate worldwide development of collaborative font projects, to support the font creation efforts of academic and linguistic communities, and to provide a free and open framework in which fonts may be shared and improved in partnership with others. The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives. DEFINITIONS "Font Software" refers to the set of files released by the Copyright Holder(s) under this license and clearly marked as such. This may include source files, build scripts and documentation. "Reserved Font Name" refers to any names specified as such after the copyright statement(s). "Original Version" refers to the collection of Font Software components as distributed by the Copyright Holder(s). "Modified Version" refers to any derivative made by adding to, deleting, or substituting -- in part or in whole -- any of the components of the Original Version, by changing formats or by porting the Font Software to a new environment. "Author" refers to any designer, engineer, programmer, technical writer or other person who contributed to the Font Software. PERMISSION & CONDITIONS Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software, to use, study, copy, merge, embed, modify, redistribute, and sell modified and unmodified copies of the Font Software, subject to the following conditions: 1) Neither the Font Software nor any of its individual components, in Original or Modified Versions, may be sold by itself. 2) Original or Modified Versions of the Font Software may be bundled, redistributed and/or sold with any software, provided that each copy contains the above copyright notice and this license. These can be included either as stand-alone text files, human-readable headers or in the appropriate machine-readable metadata fields within text or binary files as long as those fields can be easily viewed by the user. 3) No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written permission is granted by the corresponding Copyright Holder. This restriction only applies to the primary font name as presented to the users. 4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font Software shall not be used to promote, endorse or advertise any Modified Version, except to acknowledge the contribution(s) of the Copyright Holder(s) and the Author(s) or with their explicit written permission. 5) The Font Software, modified or unmodified, in part or in whole, must be distributed entirely under this license, and must not be distributed under any other license. The requirement for fonts to remain under this license does not apply to any document created using the Font Software. TERMINATION This license becomes null and void if any of the above conditions are not met. DISCLAIMER THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE. </license-notice> <license-notice name="OpenSans Font"> Apache License Version 2.0, January 2004 http://www.apache.org/licenses/ TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION 1. Definitions. "License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document. "Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License. "Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, "control" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity. "You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License. "Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files. "Object" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types. "Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below). "Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof. "Contribution" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as "Not a Contribution." "Contributor" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work. 2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form. 3. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed. 4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions: (a) You must give any other recipients of the Work or Derivative Works a copy of this License; and (b) You must cause any modified files to carry prominent notices stating that You changed the files; and (c) You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and (d) If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License. You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License. 5. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions. 6. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file. 7. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License. 8. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages. 9. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability. END OF TERMS AND CONDITIONS APPENDIX: How to apply the Apache License to your work. To apply the Apache License to your work, attach the following boilerplate notice, with the fields enclosed by brackets "[]" replaced with your own identifying information. (Don\'t include the brackets!) The text should be enclosed in the appropriate comment syntax for the file format. We also recommend that a file or class name and description of purpose be included on the same "printed page" as the copyright notice for easier identification within third-party archives. Copyright [yyyy] [name of copyright owner] Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. </license-notice>', '', '', function(opts) {
});

riot.tag2('color-input', '<div class="color-input-aPicker" riot-style="background-color: {value};" onclick="{openPicker}"><span riot-style="color: {dark? \'#fff\' : \'#000\'};">{value}</span></div> <color-picker ref="colorPicker" if="{opened}" color="{value}" onapply="{applyColor}" oncancel="{cancelColor}"></color-picker>', '', '', function(opts) {
    this.opened = false;
    this.value = this.lastValue = this.opts.color || '#FFFFFF';
    this.openPicker = e => {
        this.opened = !this.opened;
    };
    this.applyColor = color => {
        this.value = color;
        this.dark = this.refs.colorPicker.dark;
        if (this.opts.onapply) {
            this.opts.onapply(value);
        }
        if (this.opts.onchange) {
            this.opts.onchange({
                target: this
            }, this.value);
        }
        this.opened = false;
        this.update();
    };
    this.cancelColor = () => {
        this.opened = false;
        this.update();
    };
    this.on('update', () => {
        if (this.lastValue != this.opts.color) {
            this.value = this.lastValue = this.opts.color || '#FFFFFF';
        }
    });
});

riot.tag2('color-picker', '<div class="panel" ref="widget"> <div class="color-picker-aBackgroundToggler"></div> <div class="color-picker-aBackgoundWell flexrow"> <div class="c6 swatch" riot-style="background-color: {oldColor.toString()};"><span riot-style="color: {oldColor.getLuminance() &lt; 0.5? \'white\' : \'black\'};">{voc.old}</span></div><span>&nbsp;</span> <div class="c6 swatch" riot-style="background-color: {color.toString()};"><span riot-style="color: {color.getLuminance() &lt; 0.5? \'white\' : \'black\'};">{voc.current}</span></div> </div> <div class="c6 npt npl npb"> <h4 class="nmt">{voc.globalPalette}</h4> <div class="Swatches" ref="globalSwatches"> <div class="aSwatch" each="{colr in globalPalette}" riot-style="background-color: {colr};" onclick="{onSwatchClick}"></div> <button class="anAddSwatchButton" onclick="{addAsGlobal}">+ </button> </div> <h4>{voc.projectPalette}</h4> <div class="Swatches" ref="localSwatches"> <div class="aSwatch" each="{colr in window.currentProject.palette}" riot-style="background-color: {colr};" onclick="{onSwatchClick}"></div> <button class="anAddSwatchButton" onclick="{addAsLocal}">+ </button> </div> </div> <div class="c6 npt npr npb"> <div class="flexrow"> <div class="aRangePipeStack"> <div class="pipe huebar"></div> <div class="pipe" riot-style="background-color: rgba(255, 255, 255, {1 - color.getSaturation()});"></div> <div class="pipe" riot-style="background-color: rgba(0, 0, 0, {1 - color.getValue()});"></div> <input class="transparent" type="range" riot-value="{color.getHue()}" min="0" max="359" oninput="{updateHue}"> </div> <input class="short" min="0" max="359" riot-value="{color.getHue()}" onchange="{updateHue}" type="{\'number\'}"> </div> <div class="flexrow"> <div class="aRangePipeStack"> <div class="pipe" riot-style="background: linear-gradient(to right, {color.setAlpha(1).desaturateByRatio(1).toCSS()} 0%, {color.setAlpha(1).saturateByAmount(1).toCSS()} 100%);"></div> <input class="transparent" type="range" riot-value="{~~(color.getSaturation() * 100)}" min="0" max="100" oninput="{updateSaturation}"> </div> <input class="short" min="0" max="100" riot-value="{~~(color.getSaturation() * 100)}" onchange="{updateSaturation}" type="{\'number\'}"> </div> <div class="flexrow"> <div class="aRangePipeStack"> <div class="pipe" riot-style="background: linear-gradient(to right, {color.setAlpha(1).devalueByRatio(1).toCSS()} 0%, {color.setAlpha(1).valueByAmount(1).toCSS()} 100%);"></div> <input class="transparent" type="range" riot-value="{~~(color.getValue() * 100)}" min="0" max="100" oninput="{updateValue}"> </div> <input class="short" min="0" max="100" riot-value="{~~(color.getValue() * 100)}" onchange="{updateValue}" type="{\'number\'}"> </div> <div class="flexrow"> <div class="aRangePipeStack" hide="{opts.hidealpha}"> <div class="pipe alphabar"></div> <div class="pipe" riot-style="background: linear-gradient(to right, transparent 0%, {color.setAlpha(1).toCSS()} 100%);"></div> <input class="transparent" type="range" riot-value="{~~(color.getAlpha() * 100)}" min="0" max="100" oninput="{updateAlpha}"> </div> <input class="short" min="0" max="100" riot-value="{~~(color.getAlpha() * 100)}" onchange="{updateAlpha}" type="{\'number\'}"> </div> <input class="wide" type="text" ref="colorValue" riot-value="{color.toString()}" onchange="{tryInputColor}"> </div> <div class="clear"></div> <div class="flexrow color-picker-Buttons"> <button class="nml" onclick="{cancelColor}"><i class="icon-times"></i><span> {vocGlob.cancel}</span></button> <button class="nmr" onclick="{applyColor}"><i class="icon-apply"></i><span> {vocGlob.apply}</span></button> </div> </div>', '', '', function(opts) {
    const Color = net.brehaut.Color;
    this.namespace = 'colorPicker';
    this.mixin(window.riotVoc);

    this.loadColor = color => {
        this.color = Color(color);
        this.color = this.color.setValue(this.color.getValue());
        this.oldColor = Color(color);
    };
    this.loadColor(this.opts.color || '#ffffff');

    if (!('palette' in window.currentProject)) {
        window.currentProject.palette = [];
    }
    if ('globalPalette' in window.localStorage) {
        this.globalPalette = JSON.parse(localStorage.globalPalette);
    } else {
        this.globalPalette = [];
        localStorage.globalPalette = JSON.stringify(this.globalPalette);
    }

    this.getColor = () => this.color.toString();

    this.updateHue = e => {
        this.color = this.color.setHue(e.target.value);
        this.notifyUpdates();
    };
    this.updateSaturation = e => {
        this.color = this.color.setSaturation(e.target.value / 100);
        this.notifyUpdates();
    };
    this.updateValue = e => {
        this.color = this.color.setValue(e.target.value / 100);
        this.notifyUpdates();
    };
    this.updateAlpha = e => {
        this.color = this.color.setAlpha(e.target.value / 100);
        this.notifyUpdates();
    };
    this.tryInputColor = e => {
        this.color = Color(e.target.value);
        this.notifyUpdates();
    };

    this.onSwatchClick = e => {
        if (e.ctrlKey) {
            if (e.target.parentNode === this.refs.localSwatches) {
                window.currentProject.palette.splice(window.currentProject.palette.indexOf(e.item.colr), 1);
            } else {
                this.globalPalette.splice(this.globalPalette.indexOf(e.item.colr), 1);
                localStorage.globalPalette = JSON.stringify(this.globalPalette);
            }
        } else {
            this.color = Color(e.item.colr);
            this.notifyUpdates();
        }
    };
    this.addAsGlobal = e => {
        this.globalPalette.push(this.color.toString());
        localStorage.globalPalette = JSON.stringify(this.globalPalette);
    };
    this.addAsLocal = e => {
        window.currentProject.palette.push(this.color.toString());
    };

    this.notifyUpdates = () => {
        this.dark = this.color.getLuminance() < 0.5;
        if (this.opts.onchanged) {
            this.opts.onchanged(this.color.toString(), 'onchanged');
        }
    };
    this.applyColor = e => {
        this.dark = this.color.getLuminance() < 0.5;
        if (this.opts.onapply) {
            this.opts.onapply(this.color.toString(), 'onapply');
        }
    };
    this.cancelColor = e => {
        if (this.opts.oncancel) {
            this.opts.oncancel(this.color.toString(), 'oncancel');
        }
    }
});

riot.tag2('graphic-editor', '<div class="column borderright tall column1 flexfix"> <div class="flexfix-body"><b>{voc.name}</b><br> <input class="wide" type="text" riot-value="{opts.graphic.name}" onchange="{wire(\'this.graphic.name\')}"><br><b>{voc.center}</b> <div class="flexrow"> <input class="short" riot-value="{opts.graphic.axis[0]}" onchange="{wire(\'this.graphic.axis.0\')}" type="{\'number\'}"><span class="center"> × </span> <input class="short" riot-value="{opts.graphic.axis[1]}" onchange="{wire(\'this.graphic.axis.1\')}" type="{\'number\'}"> </div><br> <button class="wide" onclick="{graphicCenter}"><span> {voc.setcenter}</span></button><br><b>{voc.form}</b><br> <label> <input type="radio" name="collisionform" checked="{opts.graphic.shape === \'circle\'}" onclick="{graphicSelectCircle}"><span>{voc.round}</span> </label><br> <label> <input type="radio" name="collisionform" checked="{opts.graphic.shape === \'rect\'}" onclick="{graphicSelectRect}"><span>{voc.rectangle}</span> </label><br> <div if="{opts.graphic.shape === \'circle\'}"><b>{voc.radius}</b><br> <input class="wide" riot-value="{opts.graphic.r}" onchange="{wire(\'this.graphic.r\')}" type="{\'number\'}"> </div> <div if="{opts.graphic.shape === \'rect\'}"> <div class="center"> <input class="short" riot-value="{opts.graphic.top}" onchange="{wire(\'this.graphic.top\')}" type="{\'number\'}"><br> <input class="short" riot-value="{opts.graphic.left}" onchange="{wire(\'this.graphic.left\')}" type="{\'number\'}"><span> × </span> <input class="short" riot-value="{opts.graphic.right}" onchange="{wire(\'this.graphic.right\')}" type="{\'number\'}"><br> <input class="short" riot-value="{opts.graphic.bottom}" onchange="{wire(\'this.graphic.bottom\')}" type="{\'number\'}"> </div><br> <button class="wide" onclick="{graphicFillRect}"><i class="icon-maximize"></i><span>{voc.fill}</span></button> </div> </div> <div class="flexfix-footer"> <button class="wide" onclick="{graphicSave}"> <i class="icon-save"></i><span>{window.languageJSON.common.save}</span></button> </div> </div> <div class="column column2 borderleft tall flexfix"> <div class="flexfix-body"> <div class="fifty np"><b>{voc.cols}</b><br> <input class="wide" riot-value="{opts.graphic.grid[0]}" onchange="{wire(\'this.graphic.grid.0\')}" type="{\'number\'}"> </div> <div class="fifty np"><b>{voc.rows}</b><br> <input class="wide" riot-value="{opts.graphic.grid[1]}" onchange="{wire(\'this.graphic.grid.1\')}" type="{\'number\'}"> </div> <div class="clear"></div> <div class="fifty np"><b>{voc.width}</b><br> <input class="wide" riot-value="{opts.graphic.width}" onchange="{wire(\'this.graphic.width\')}" type="{\'number\'}"> </div> <div class="fifty np"><b>{voc.height}</b><br> <input class="wide" riot-value="{opts.graphic.height}" onchange="{wire(\'this.graphic.height\')}" type="{\'number\'}"> </div> <div class="clear"></div> <div class="fifty np"><b>{voc.marginx}</b><br> <input class="wide" riot-value="{opts.graphic.marginx}" onchange="{wire(\'this.graphic.marginx\')}" type="{\'number\'}"> </div> <div class="fifty np"><b>{voc.marginy}</b><br> <input class="wide" riot-value="{opts.graphic.marginy}" onchange="{wire(\'this.graphic.marginy\')}" type="{\'number\'}"> </div> <div class="clear"></div> <div class="fifty np"><b>{voc.offx}</b><br> <input class="wide" riot-value="{opts.graphic.offx}" onchange="{wire(\'this.graphic.offx\')}" type="{\'number\'}"> </div> <div class="fifty np"><b>{voc.offy}</b><br> <input class="wide" riot-value="{opts.graphic.offy}" onchange="{wire(\'this.graphic.offy\')}" type="{\'number\'}"> </div> <div class="clear"></div><b>{voc.frames}</b><br> <input class="wide" id="graphframes" riot-value="{opts.graphic.untill}" onchange="{wire(\'this.graphic.untill\')}" type="{\'number\'}"> </div> <div class="preview bordertop flexfix-footer"> <div id="preview" ref="preview" riot-style="background-color: {previewColor};"> <canvas ref="grprCanvas"></canvas> </div> <div> <button class="square inline" id="graphplay" onclick="{currentGraphicPreviewPlay}"><i class="icon-{this.prevPlaying? \'pause\' : \'play\'}"></i></button> <button class="square inline" id="graphviewback" onclick="{currentGraphicPreviewBack}"><i class="icon-back"></i></button> <button class="square inline" id="graphviewnext" onclick="{currentGraphicPreviewNext}"><i class="icon-next"></i></button><span ref="graphviewframe">0 / 1</span><br><b>{voc.speed}</b> <input class="short" id="grahpspeed" riot-value="{prevSpeed}" onchange="{wire(this.prevSpeed)}" type="{\'number\'}"> </div> <div class="relative"> <button class="inline wide" id="graphcolor" onclick="{changeGraphicPreviewColor}"><i class="icon-drop"></i><span>{voc.bgcolor}</span></button> </div> <input class="color rgb" id="previewbgcolor"><br> <label> <input checked="{prevShowMask}" onchange="{wire(\'this.prevShowMask\')}" type="checkbox"><span> {voc.showmask}</span> </label> </div> </div> <color-picker ref="previewBackgroundColor" if="{changingGraphicPreviewColor}" color="{previewColor}" onapply="{updatePreviewColor}" onchanged="{updatePreviewColor}" oncancel="{cancelPreviewColor}"></color-picker> <div class="graphic-editor-anAtlas" riot-style="background-color: {previewColor};"> <div class="graphview-tools"> <label class="toright file" title="{voc.replacegraph}"> <input type="file" ref="graphReplacer" accept=".png,.jpg,.jpeg,.bmp,.gif" onchange="{graphReplace}"> <div class="button inline"><i class="icon-folder"></i><span>{voc.replacegraph}</span></div> </label> </div> <canvas ref="graphCanvas"></canvas> </div>', '', 'class="panel view"', function(opts) {
    const path = require('path'),
          fs = require('fs-extra');
    this.namespace = 'graphview';
    this.mixin(window.riotVoc);
    this.mixin(window.riotWired);

    this.prevPlaying = true;
    this.prevPos = 0;
    this.prevSpeed = 10;
    this.prevShowMask = true;
    this.previewColor = '#ffffff';

    var graphCanvas, grprCanvas;

    this.on('mount', () => {
        graphCanvas = this.refs.graphCanvas;
        grprCanvas = this.refs.grprCanvas;
        graphCanvas.x = graphCanvas.getContext('2d');
        grprCanvas.x = grprCanvas.getContext('2d');
        var graphic = this.graphic = this.opts.graphic;
        var img = document.createElement('img');
        img.onload = () => {
            graphCanvas.img = img;
            this.update();
            setTimeout(() => {
                this.launchGraphPreview();
            }, 0);
        };
        img.onerror = e => {
            alertify.error(languageJSON.graphview.corrupted);
            console.error(e);
            this.graphicSave();
        };
        img.src = path.join('file://', sessionStorage.projdir, '/img/', graphic.origname) + '?' + Math.random();
    });
    this.on('updated', () => {
        this.refreshGraphCanvas();
    });
    this.on('unmount', () => {
        if (this.prevPlaying) {
            this.stopGraphPreview();
        }
    });

    this.graphReplace = e => {
        if (/\.(jpg|gif|png|jpeg)/gi.test(this.refs.graphReplacer.value)) {
            console.log(this.refs.graphReplacer.value, 'passed');
            this.loadImg(
                parseInt(this.graphic.origname.slice(1)),
                this.refs.graphReplacer.value,
                sessionStorage.projdir + '/img/i' + parseInt(this.graphic.origname.slice(1)) + path.extname(this.refs.graphReplacer.value)
            );
        } else {
            alertify.error(window.languageJSON.common.wrongFormat);
            console.log(this.refs.graphReplacer.value, 'NOT passed');
        }
        this.refs.graphReplacer.value = '';
    };

    this.loadImg = (uid, filename, dest) => {
        console.log(uid, filename, 'copying');
        window.megacopy(filename, dest, e => {
            console.log(uid, filename, 'copy finished');
            if (e) throw e;
            image = document.createElement('img');
            image.onload = () => {
                this.graphic.width = this.graphic.imgWidth = image.width;
                this.graphic.height = this.graphic.imgHeight = image.height;
                this.graphic.origname = path.basename(dest);
                graphCanvas.img = image;
                this.graphic.lastmod = +(new Date());
                this.parent.imgGenPreview(dest, dest + '_prev.png', 64, () => {
                    console.log(uid, filename, 'preview generated');
                    this.update();
                });
                this.parent.imgGenPreview(dest, dest + '_prev@2.png', 128, () => {
                    console.log(uid, filename, 'hdpi preview generated');
                });
                setTimeout(() => {
                    this.refreshGraphCanvas();
                    this.launchGraphPreview();
                }, 0);
            };
            image.onerror = e => {
                alertify.error(e);
            };
            image.src = 'file://' + dest + '?' + Math.random();
        });
    };

    this.graphicDeleteFrame = e => {

    };
    this.graphicDuplicateFrame = e => {

    };
    this.graphicAddFrame = e => {

    };
    this.graphicShift = e => {

    };
    this.graphicFlipVertical = e => {

    };
    this.graphicFlipHorizontal = e => {

    };
    this.graphicRotate = e => {

    };
    this.graphicResize = e => {

    };
    this.graphicCrop = e => {

    };

    this.graphicCenter = e => {
        var graphic = this.graphic;
        graphic.axis[0] = Math.floor(graphic.width / 2);
        graphic.axis[1] = Math.floor(graphic.height / 2);
    };

    this.graphicFillRect = e => {
        var graphic = this.graphic;
        graphic.left = ~~(graphic.axis[0]);
        graphic.top = ~~(graphic.axis[1]);
        graphic.right = ~~(graphic.width - graphic.axis[0]);
        graphic.bottom = ~~(graphic.height - graphic.axis[1]);
    };

    this.currentGraphicPreviewPlay = e => {
        if (this.prevPlaying) {
            this.stopGraphPreview();
        } else {
            this.launchGraphPreview();
        }
        this.prevPlaying = !this.prevPlaying;
    };

    this.currentGraphicPreviewBack = e => {
        this.prevPos--;
        var graphic = this.graphic;
        var total = graphic.untill === 0? graphic.grid[0] * graphic.grid[1] : Math.min(graphic.grid[0] * graphic.grid[1], graphic.untill);
        if (this.prevPos < 0) {
            this.prevPos = graphic.untill === 0 ? graphic.grid[0] * graphic.grid[1] : total - 0;
        }
        this.refreshPreviewCanvas();
    };

    this.currentGraphicPreviewNext = e => {
        this.prevPos++;
        var graphic = this.graphic;
        var total = graphic.untill === 0? graphic.grid[0] * graphic.grid[1] : Math.min(graphic.grid[0] * graphic.grid[1], graphic.untill);
        if (this.prevPos >= total) {
            this.prevPos = 0;
        }
        this.refreshPreviewCanvas();
    };
    this.refreshPreviewCanvas = () => {
        let xx = this.prevPos % this.graphic.grid[0],
            yy = Math.floor(this.prevPos / this.graphic.grid[0]),
            x = this.graphic.offx + xx * (this.graphic.marginx + this.graphic.width),
            y = this.graphic.offy + yy * (this.graphic.marginy + this.graphic.height),
            w = this.graphic.width,
            h = this.graphic.height;
        grprCanvas.width = w;
        grprCanvas.height = h;

        grprCanvas.x.clearRect(0, 0, grprCanvas.width, grprCanvas.height);
        grprCanvas.x.drawImage(
            graphCanvas.img,
            x, y, w, h,
            0, 0, w, h
        );

        if (this.prevShowMask) {
            grprCanvas.x.globalAlpha = 0.5;
            grprCanvas.x.fillStyle = '#ff0';
            if (this.graphic.shape == 'rect') {
                grprCanvas.x.fillRect(
                    this.graphic.axis[0] - this.graphic.left,
                    this.graphic.axis[1] - this.graphic.top,
                    this.graphic.right + this.graphic.left,
                    this.graphic.bottom + this.graphic.top
                );
            } else {
                grprCanvas.x.beginPath();
                grprCanvas.x.arc(this.graphic.axis[0], this.graphic.axis[1], this.graphic.r, 0, 2 * Math.PI);
                grprCanvas.x.fill();
            }
        }
    };

    this.stopGraphPreview = () => {
        window.clearTimeout(this.prevTime);
    };

    this.launchGraphPreview = () => {
        var graphic = this.graphic;
        if (this.prevTime) {
            window.clearTimeout(this.prevTime);
        }
        this.prevPos = 0;
        this.stepGraphPreview();
    };

    this.stepGraphPreview = () => {
        var graphic = this.graphic;
        this.prevTime = window.setTimeout(() => {
            var total = Math.min(graphic.untill === 0 ? Infinity : graphic.untill, graphic.grid[0] * graphic.grid[1]);
            this.prevPos++;
            if (this.prevPos >= total) {
                this.prevPos = 0;
            }
            this.refs.graphviewframe.innerHTML = `${this.prevPos} / ${total}`;
            this.refreshPreviewCanvas();
            this.stepGraphPreview();
        }, ~~(1000 / this.prevSpeed));
    };

    this.graphicSelectCircle = function() {
        this.graphic.shape = 'circle';
        if (!('r' in this.graphic) || this.graphic.r === 0) {
            this.graphic.r = Math.min(
                Math.floor(this.graphic.width / 2),
                Math.floor(this.graphic.height / 2)
            );
        }
    };

    this.graphicSelectRect = function() {
        this.graphic.shape = 'rect';
        this.graphicFillRect();
    };

    this.refreshGraphCanvas = () => {
        graphCanvas.width = graphCanvas.img.width;
        graphCanvas.height = graphCanvas.img.height;
        graphCanvas.x.strokeStyle = "#0ff";
        graphCanvas.x.lineWidth = 1;
        graphCanvas.x.globalCompositeOperation = 'source-over';
        graphCanvas.x.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        graphCanvas.x.drawImage(graphCanvas.img, 0, 0);
        graphCanvas.x.globalAlpha = 0.5;
        for (let i = 0, l = Math.min(this.graphic.grid[0] * this.graphic.grid[1], this.graphic.untill || Infinity); i < l; i++) {
            let xx = i % this.graphic.grid[0],
                yy = Math.floor(i / this.graphic.grid[0]),
                x = this.graphic.offx + xx * (this.graphic.marginx + this.graphic.width),
                y = this.graphic.offy + yy * (this.graphic.marginy + this.graphic.height),
                w = this.graphic.width,
                h = this.graphic.height;
            graphCanvas.x.strokeRect(x, y, w, h);
        }
        if (this.prevShowMask) {
            graphCanvas.x.fillStyle = '#ff0';
            if (this.graphic.shape == 'rect') {
                graphCanvas.x.fillRect(
                    this.graphic.axis[0] - this.graphic.left,
                    this.graphic.axis[1] - this.graphic.top,
                    this.graphic.right + this.graphic.left,
                    this.graphic.bottom + this.graphic.top
                );
            } else {
                graphCanvas.x.beginPath();
                graphCanvas.x.arc(this.graphic.axis[0], this.graphic.axis[1], this.graphic.r, 0, 2 * Math.PI);
                graphCanvas.x.fill();
            }
        }
    };

    this.graphicSave = () => {
        this.parent.fillGraphMap();
        window.glob.modified = true;
        this.graphic.lastmod = +(new Date());
        this.graphGenPreview(sessionStorage.projdir + '/img/' + this.graphic.origname + '_prev@2.png', 128);
        this.graphGenPreview(sessionStorage.projdir + '/img/' + this.graphic.origname + '_prev.png', 64)
        .then(() => {
            this.parent.editing = false;
            this.parent.update();
        });
    };

    this.graphGenPreview = function(destination, size) {
        return new Promise((accept, decline) => {

            var c = document.createElement('canvas');
            let x = this.graphic.offx,
                y = this.graphic.offy,
                w = this.graphic.width,
                h = this.graphic.height;
            c.x = c.getContext('2d');
            c.width = c.height = size;
            c.x.clearRect(0, 0, size, size);
            if (w > h) {
                k = size / w;
            } else {
                k = size / h;
            }
            if (k > 1) k = 1;
            c.x.drawImage(graphCanvas.img,
                x, y, w, h,
                (size - w*k) / 2, (size - h*k) / 2,
                w*k, h*k
            );
            var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, '');
            var buf = new Buffer(data, 'base64');
            fs.writeFile(destination, buf, function(err) {
                if (err) {
                    console.log(err);
                    decline(err);
                } else {
                    accept(destination);
                }
            });
        });
    };

    this.changeGraphicPreviewColor = e => {
        this.changingGraphicPreviewColor = !this.changingGraphicPreviewColor;
        if (this.changingGraphicPreviewColor) {
            this.oldPreviewColor = this.previewColor;
        }
    };
    this.updatePreviewColor = (color, evtype) => {
        this.previewColor = color;
        if (evtype === 'onapply') {
            this.changingGraphicPreviewColor = false;
        }
        this.update();
    };
    this.cancelPreviewColor = () => {
        this.changingGraphicPreviewColor = false;
        this.previewColor = this.oldPreviewColor;
        this.update();
    };
});

riot.tag2('graphic-selector', '<ul class="cards"> <li if="{opts.showempty}" onclick="{onselected(-1)}"><span>{window.languageJSON.common.none}</span><img src="/img/nograph.png"></li> <li each="{graphic in window.currentProject.graphs}" onclick="{onselected(graphic)}"><span>{graphic.name}</span><img riot-src="file://{sessionStorage.projdir + \'/img/\' + graphic.origname + \'_prev.png\'}"></li> </ul>', '', 'class="panel view"', function(opts) {
    this.onselected = this.opts.onselected;
    this.namespace = 'common';
    this.mixin(window.riotVoc);
});

riot.tag2('graphics-panel', '<label class="file"> <input type="file" multiple accept=".png,.jpg,.jpeg,.bmp,.gif" onchange="{graphicImport}"> <div class="button"><i class="icon icon-import"></i><span>{voc.import}</span></div> </label> <ul class="cards"> <li each="{graphic in window.currentProject.graphs}" oncontextmenu="{showGraphicPopup(graphic)}" onclick="{openGraphic(graphic)}"><span>{graphic.name}</span><img riot-src="file://{sessionStorage.projdir + \'/img/\' + graphic.origname + \'_prev.png?\' + graphic.lastmod}"></li> </ul> <div class="aDropzone" if="{dropping}"> <div class="middleinner"><i class="icon-import"></i> <h2>{languageJSON.common.fastimport}</h2> <input type="file" multiple accept=".png,.jpg,.jpeg,.bmp,.gif" onchange="{graphicImport}"> </div> </div> <graphic-editor if="{editing}" graphic="{currentGraphic}"></graphic-editor>', '', 'class="panel view"', function(opts) {
    const fs = require('fs-extra'),
          path = require('path'),
          gui = require('nw.gui');
    this.namespace = 'graphic';
    this.mixin(window.riotVoc);
    this.editing = false;
    this.dropping = false;

    this.fillGraphMap = () => {
        glob.graphmap = {};
        window.currentProject.graphs.forEach(graph => {
            var img = document.createElement('img');
            glob.graphmap[graph.origname] = img;
            img.g = graph;
            img.src = 'file://' + sessionStorage.projdir + '/img/' + graph.origname + '?' + graph.lastmod;
        });
        var img = document.createElement('img');
        glob.graphmap[-1] = img;
        img.src = '/img/unknown.png';
    };
    this.on('mount', () => {
        this.fillGraphMap();
    });

    this.graphicImport = e => {
        var i;
        files = e.target.value.split(';');
        for (i = 0; i < files.length; i++) {
            if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {

                currentProject.graphtick++;
                this.loadImg(
                    i,
                    files[i],
                    sessionStorage.projdir + '/img/i' + currentProject.graphtick + path.extname(files[i]),
                    true
                );
            } else {

            }
        }
        this.dropping = false;
        e.preventDefault();
    };

    this.loadImg = (uid, filename, dest, imprt) => {
        window.megacopy(filename, dest, e => {
            if (e) throw e;
            var image = document.createElement('img');
            image.onload = () => {
                setTimeout(() => {
                    var obj = {
                        name: path.basename(filename).replace(/\.(jpg|gif|png|jpeg)/gi, '').replace(/\s/g, '_'),
                        untill: 0,
                        grid: [1, 1],
                        axis: [0, 0],
                        marginx: 0,
                        marginy: 0,
                        imgWidth: image.width,
                        imgHeight: image.height,
                        width: image.width,
                        height: image.height,
                        offx: 0,
                        offy: 0,
                        origname: path.basename(dest),
                        shape: 'rect',
                        left: 0,
                        right: image.width,
                        top: 0,
                        bottom: image.height
                    };
                    this.id = currentProject.graphs.length;
                    window.currentProject.graphs.push(obj);
                    this.imgGenPreview(dest, dest + '_prev.png', 64)
                    .then(dataUrl => {
                        this.update();
                    });
                    this.imgGenPreview(dest, dest + '_prev@2.png', 128);
                    this.fillGraphMap();
                }, 0);
            }
            image.onerror = e => {
                alertify.error(e);
            }
            image.src = 'file://' + dest + '?' + Math.random();
        });
    };

    this.imgGenPreview = (source, destFile, size) => {
        var thumbnail = document.createElement('img');
        return new Promise((accept, reject) => {
            thumbnail.onload = () => {
                var c = document.createElement('canvas'),
                w, h, k;
                c.x = c.getContext('2d');
                c.width = c.height = size;
                c.x.clearRect(0, 0, size, size);
                w = size, thumbnail.width;
                h = size, thumbnail.height;
                if (w > h) {
                    k = size / w;
                } else {
                    k = size / h;
                }
                if (k > 1) k = 1;
                c.x.drawImage(
                    thumbnail,
                    (size - thumbnail.width*k)/2,
                    (size - thumbnail.height*k)/2,
                    thumbnail.width*k,
                    thumbnail.height*k
                );

                var dataURL = c.toDataURL();
                var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
                var buf = new Buffer(data, 'base64');
                fs.writeFile(destFile, buf, err => {
                    if (err) {
                        reject(err);
                    } else {
                        accept(dataURL);
                    }
                });
            }
            thumbnail.src = 'file://' + source;
        });
    };

    var graphMenu = new gui.Menu();
    graphMenu.append(new gui.MenuItem({
        label: languageJSON.common.open,
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
        click: e => {
            this.openGraphic(this.currentGraphic);
            this.update();
        }
    }));

    graphMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.duplicate,
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
        click: e => {
            alertify
            .defaultValue(currentGraphic.name + '_dup')
            .prompt(window.languageJSON.common.newnam)
            .then(e => {
                if (e.inputValue != '') {
                    var newGraphic = JSON.parse(JSON.stringify(currentGraphic));
                    newGraphic.name = e.inputValue;
                    window.currentProject.graphtick ++;
                    newGraphic.origname = 'i' + currentProject.graphtick + path.extname(currentGraphic.origname);
                    window.megacopy(sessionStorage.projdir + '/img/' + currentGraphic.origname, sessionStorage.projdir + '/img/i' + currentProject.graphtick + path.extname(this.currentGraphic.origname), () => {
                        window.currentProject.graphs.push(gr);
                        this.update();
                    });
                }
            });
        }
    }));

    graphMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.rename,
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
        click: e => {
            alertify
            .defaultValue(currentGraphic.name)
            .prompt(window.languageJSON.common.newname)
            .then(e => {
                if (e.inputValue != '') {
                    currentGraphic.name = e.inputValue;
                    this.update();
                }
            });
        }
    }));
    graphMenu.append(new gui.MenuItem({
        type: 'separator'
    }));

    graphMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.delete,
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
        click: e => {
            alertify
            .okBtn(window.languageJSON.common.delete)
            .cancelBtn(window.languageJSON.common.cancel)
            .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentGraphic.name))
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    window.currentProject.graphs.splice(this.currentGraphicId,1);
                    this.update();
                }
            })
            .reset();
        }
    }));

    this.showGraphicPopup = graphic => e => {
        this.currentGraphicId = currentProject.graphs.indexOf(graphic);
        this.currentGraphic = graphic;
        graphMenu.popup(e.clientX, e.clientY);
        e.preventDefault();
    };

    this.openGraphic = graphic => e => {
        this.currentGraphic = graphic;
        this.currentGraphicId = window.currentProject.graphs.indexOf(graphic);
        this.editing = true;
    };

    var dragTimer;
    this.onDragOver = e => {
        var dt = e.dataTransfer;
        if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
            this.dropping = true;
            this.update();
            window.clearTimeout(dragTimer);
        }
        e.preventDefault();
        e.stopPropagation();
    };
    this.onDrop = e => {
         e.stopPropagation();
    };
    this.onDragLeave = e => {
        dragTimer = window.setTimeout(() => {
            this.dropping = false;
            this.update()
        }, 25);
        e.preventDefault();
        e.stopPropagation();
    };
    this.on('mount', () => {
        document.addEventListener('dragover', this.onDragOver);
        document.addEventListener('dragleave', this.onDragLeave);
        document.addEventListener('drop', this.onDrop);
    });
    this.on('unmount', () => {
        document.removeEventListener('dragover', this.onDragOver);
        document.removeEventListener('dragleave', this.onDragLeave);
        document.removeEventListener('drop', this.onDrop);
    });
});

riot.tag2('main-menu', '<nav class="nogrow flexrow" if="{window.currentProject}"> <ul class="nav" id="fullscreen"> <li onclick="{toggleFullscreen}" title="{voc.min}"><i class="icon-{fullscreen? \'minimize-2\' : \'maximize-2\'}"></i></li> </ul> <ul class="nav tabs" id="app"> <li class="it30" id="ctlogo" onclick="{ctClick}" title="{voc.ctIDE}"><i class="icon-menu"></i></li> <li class="it30" onclick="{saveProject}" title="{voc.save}"><i class="icon-save"></i></li> <li class="it30" onclick="{runProject}" title="{voc.launch}"><i class="icon-play"></i></li> </ul> <ul class="nav tabs" id="mainnav"> <li class="{active: tab === \'settings\'}" onclick="{changeTab(\'settings\')}"><i class="icon-settings"></i><span>{voc.settings}</span></li> <li class="{active: tab === \'modules\'}" onclick="{changeTab(\'modules\')}"><i class="icon-mod"></i><span>{voc.modules}</span></li> <li class="{active: tab === \'graphic\'}" onclick="{changeTab(\'graphic\')}"><i class="icon-picture"></i><span>{voc.graphic}</span></li> <li class="{active: tab === \'styles\'}" onclick="{changeTab(\'styles\')}"><i class="icon-droplet"></i><span>{voc.styles}</span></li> <li class="{active: tab === \'sounds\'}" onclick="{changeTab(\'sounds\')}"><i class="icon-headphones"></i><span>{voc.sounds}</span></li> <li class="{active: tab === \'types\'}" onclick="{changeTab(\'types\')}"><i class="icon-user"></i><span>{voc.types}</span></li> <li class="{active: tab === \'rooms\'}" onclick="{changeTab(\'rooms\')}"><i class="icon-map"></i><span>{voc.rooms}</span></li> </ul> </nav> <div class="flexitem relative" if="{window.currentProject}"> <settings-panel show="{tab === \'settings\'}"></settings-panel> <modules-panel show="{tab === \'modules\'}"></modules-panel> <graphics-panel show="{tab === \'graphic\'}"></graphics-panel> <styles-panel show="{tab === \'styles\'}"></styles-panel> <sounds-panel show="{tab === \'sounds\'}"></sounds-panel> <types-panel show="{tab === \'types\'}"></types-panel> <rooms-panel show="{tab === \'rooms\'}"></rooms-panel> </div>', '', 'class="flexcol"', function(opts) {
    const fs = require('fs-extra'),
          path = require('path');
    const zip = require('cross-zip');

    this.namespace = 'menu';
    this.mixin(window.riotVoc);

    this.tab = 'settings';
    this.changeTab = tab => e => {
        this.tab = tab;
        window.signals.trigger('globalTabChanged');
    };
    const gui = require('nw.gui'),
          win = gui.Window.get();

    this.fullscreen = false;
    this.toggleFullscreen = function() {
        win.toggleFullscreen();
        this.fullscreen = !this.fullscreen;
    };

    this.ctClick = (e) => {
        catMenu.popup(e.clientX, e.clientY);
    };
    this.saveProject = () => {
        return fs.outputJSON(sessionStorage.projdir + '.ict', currentProject, {
            spaces: 2
        }).then(() => {
            alertify.success(languageJSON.common.savedcomm, "success", 3000);
            glob.modified = false;
        })
        .catch(alertify.error);
    };
    window.signals.on('saveProject', () => {
        this.saveProject();
    });
    this.runProject = e => {
        window.runCtProject()
        .then(path => {
            gui.Shell.openItem(path);
        })
        .catch(e => {
            window.alertify.error(e);
            console.error(e);
        });
    };
    this.zipProject = e => {
        this.saveProject()
        .then(() => fs.remove('./zipexport'))
        .then(() => fs.copy(sessionStorage.projdir, path.join('./zipexport', sessionStorage.projname)))
        .then(() => fs.copy(sessionStorage.projdir + '.ict', path.join('./zipexport', sessionStorage.projname + '.ict')))
        .then(() => {
            zip.zip('./zipexport/', `./${sessionStorage.projname}.zip`, err => {
                if (err) {
                    alertify.error(err);
                    console.error(err);
                    return;
                }
                nw.Shell.showItemInFolder(`./${sessionStorage.projname}.zip`);
            });
        })
        .catch(alertify.error);
    };
    this.zipExport = e => {
        fs.remove('./export.zip')
        .then(() => window.runCtProject())
        .then(() => {
            zip.zip('./export/', './export.zip', err => {
                if (err) {
                    window.fuck = err;
                    console.error(err);
                    if (err.code !== 12) {
                        alertify.error(err);
                        return;
                    }
                }
                nw.Shell.showItemInFolder('./export.zip');
            });
        })
        .catch(alertify.error);
    };

    var catMenu = new gui.Menu();
    catMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.save,
        click: this.saveProject
    }));
    catMenu.append(new gui.MenuItem({
        label: this.voc.zipProject,
        click: this.zipProject
    }));
    catMenu.append(new gui.MenuItem({
        label: this.voc.zipExport,
        click: this.zipExport
    }));
    catMenu.append(new gui.MenuItem({
        label: window.languageJSON.menu.startscreen,
        click: (e) => {
            if (!confirm(window.languageJSON.common.reallyexit)) {
                return false;
            }
            window.signals.trigger('resetAll');
        }
    }));
    catMenu.append(new gui.MenuItem({type: 'separator'}));
    var languageSubmenu = new nw.Menu();
    catMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.language,
        submenu: languageSubmenu
    }))
    catMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.ctsite,
        click: function () {
            gui.Shell.openExternal('https://ctjs.rocks/');
        }
    }));
    catMenu.append(new gui.MenuItem({type: 'separator'}));
    catMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.exit,
        click: function (e) {
            alertify
            .confirm(window.languageJSON.common.exitconfirm)
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    gui.App.quit();
                }
            });
        }
    }));

    this.switchLanguage = filename => {
        try {
            const vocDefault = fs.readJSONSync('./i18n/English.json');
            const voc = fs.readJSONSync(`./i18n/${filename}.json`);
            console.log('loaded');
            window.languageJSON = window.___extend(vocDefault, voc);
            localStorage.appLanguage = filename;
            window.signals.trigger('updateLocales');
            window.riot.update();
            console.log('changed');
        } catch(e) {
            alert('Could not open a language file: ' + e);
        }
    };
    var switchLanguage = this.switchLanguage;

    fs.readdir('./i18n/')
    .then(files => {
        files.forEach(filename => {
            var file = filename.slice(0, -5);
            languageSubmenu.append(new nw.MenuItem({
                label: file,
                click: function() {
                    console.log('clicked');
                    switchLanguage(file);
                }
            }));
        });
    })
    .catch(e => {
        alert('Could not get i18n files: ' + e);
    });
});

riot.tag2('modules-panel', '<div class="flexrow"> <div class="c3 borderright tall"> <ul id="moduleincluded"> <li each="{module in enabledModules}" onclick="{renderModule(module)}"><i class="icon-confirm"></i><span>{module}</span></li> </ul> <ul id="modulelist"> <li each="{module in allModules}" onclick="{renderModule(module)}"><i class="icon icon-{(module in window.currentProject.libs)? \'confirm on\' : \'mod off\'}"></i><span>{module}</span></li> </ul> </div> <div class="c9 tall" if="{currentModule}"> <ul class="nav tabs"> <li class="{active: tab === \'moduleinfo\'}" id="modinfo" onclick="{changeTab(\'moduleinfo\')}"><i class="icon-info"></i><span>{voc.info}</span></li> <li class="{active: tab === \'modulesettings\'}" id="modsettings" if="{currentModule.fields &amp;&amp; currentModuleName in currentProject.libs}" onclick="{changeTab(\'modulesettings\')}"><i class="icon-settings"></i><span>{voc.settings}</span></li> <li class="{active: tab === \'modulehelp\'}" id="modhelp" if="{currentModuleDocs}" onclick="{changeTab(\'modulehelp\')}"><i class="icon-document"></i><span>{voc.help}</span></li> <li class="{active: tab === \'modulelogs\'}" id="modlogs" if="{currentModuleLogs}" onclick="{changeTab(\'modulelogs\')}"><i class="icon-list"></i><span>{voc.logs}</span></li> </ul> <div> <div class="tabbed" id="moduleinfo" show="{tab === \'moduleinfo\'}"> <label class="bigpower {off: !(currentModuleName in currentProject.libs)}" onclick="{toggleModule(currentModuleName)}"><i class="icon-{currentModuleName in currentProject.libs? \'confirm\' : \'delete\'}"></i><span></span></label> <h1 id="modname"><span>{currentModule.main.name}</span><span class="version">{currentModule.main.version}</span></h1><a class="external" each="{author in currentModule.main.authors}" title="{voc.author}" href="{author.site || \'mailto:\'+author.mail}"><i class="icon-user"></i><span id="modauthor">{author.name}</span></a><i class="icon-zap warning" id="modinjects" title="{voc.hasinjects}" show="{currentModule.injects}"></i><i class="icon-settings success" id="modconfigurable" title="{voc.hasfields}" show="{currentModule.fields}"></i> <div id="modinfohtml" if="{currentModuleHelp}"> <raw ref="raw" content="{currentModuleHelp}"></raw> </div> <h1 if="{currentModule.main.license}">{voc.license}</h1> <pre if="{currentModule.main.license}"><code>{currentModuleLicense}</code></pre> </div> <div class="tabbed" id="modulesettings" show="{tab === \'modulesettings\'}" if="{currentModule.fields &amp;&amp; currentModuleName in currentProject.libs}"> <dl each="{field in currentModule.fields}"> <dt>{field.name}</dt> <dd> <textarea if="{field.type === \'textfield\'}" riot-value="{window.currentProject.libs[currentModuleName][field.id]}" onchange="{wire(\'window.currentProject.libs.\' + currentModuleName + \'.\' + field.id)}"></textarea> <input if="{field.type === \'number\'}" riot-value="{window.currentProject.libs[currentModuleName][field.id]}" onchange="{wire(\'window.currentProject.libs.\' + currentModuleName + \'.\' + field.id)}" type="{\'number\'}"> <input if="{field.type === \'checkbox\'}" type="checkbox" checked="{window.currentProject.libs[currentModuleName][field.id]}" onchange="{wire(\'window.currentProject.libs.\' + currentModuleName + \'.\' + field.id)}"> <input if="{[\'checkbox\', \'number\', \'textfield\'].indexOf(field.type) === -1}" type="text" riot-value="{window.currentProject.libs[currentModuleName][field.id]}" onchange="{wire(\'window.currentProject.libs.\' + currentModuleName + \'.\' + field.id)}"> <div class="desc" if="{field.help}"> <raw ref="raw" content="{md.render(field.help)}"></raw> </div> </dd> </dl> </div> <div class="tabbed" id="modulehelp" show="{tab === \'modulehelp\'}" if="{currentModuleDocs}"> <raw ref="raw" content="{currentModuleDocs}"></raw> </div> <div class="tabbed" id="modulelogs" show="{tab === \'modulelogs\'}" if="{currentModuleLogs}"> <h1>{voc.logs2}</h1> <raw ref="raw" content="{currentModuleLogs}"></raw> </div> </div> </div> </div>', '', 'class="panel view"', function(opts) {
    const path = require('path'),
          fs = require('fs-extra'),
          gui = require('nw.gui');
    const md = require('markdown-it')({
        html: false,
        linkify: true
    });
    this.md = md;
    this.mixin(window.riotWired);
    this.namespace = 'modules';
    this.mixin(window.riotVoc);
    var exec = path.dirname(process.execPath).replace(/\\/g,'/');

    this.currentModule = false;
    this.currentModuleHelp = '';
    this.currentModuleDocs = '';
    this.currentModuleLicense = '';

    this.tab = 'moduleinfo';
    this.changeTab = tab => e => {
        this.tab = tab;
    };

    this.allModules = [];
    this.on('update', () => {
        this.enabledModules = [];
        for (let i in window.currentProject.libs) {
            this.enabledModules.push(i);
        }
    });

    fs.readdir('./ct.libs', (err, files) => {
        if (err) {
            throw err;
        }
        for (var i = 0; i < files.length; i++) {
            if (fs.pathExistsSync(path.join('./ct.libs', files[i], 'module.json'))) {
                this.allModules.push(files[i]);
            }
        }
        this.currentModuleHelp = '';
        this.currentModuleDocs = '';
        this.currentModuleLicense = '';
        this.renderModule(this.allModules[0])();
        this.update();
    });
    this.toggleModule = moduleName => e => {
        if (window.currentProject.libs[moduleName]) {
            delete window.currentProject.libs[moduleName];
        } else {
            window.currentProject.libs[moduleName] = {};

            if (this.currentModule.fields && currentProject.libs[name]) {
                for (var k in this.currentModule.fields) {
                    if (!currentProject.libs[name][this.currentModule.fields[k].key]) {
                        if (this.currentModule.fields[k].default) {
                            currentProject.libs[name][this.currentModule.fields[k].key] = this.currentModule.fields[k].default;
                        } else {
                            if (this.currentModule.fields[k].type == 'number') {
                                currentProject.libs[name][this.currentModule.fields[k].key] = 0;
                            } else if (this.currentModule.fields[k].type == 'checkbox') {
                                currentProject.libs[name][this.currentModule.fields[k].key] = false;
                            } else {
                                currentProject.libs[name][this.currentModule.fields[k].key] = '';
                            }
                        }
                    }
                }
            }
        }
        this.renderModule(moduleName)(e);
        window.glob.modified = true;
    };
    this.renderModule = name => e => {
        fs.readJSON(path.join('./ct.libs', name, 'module.json'), (err, data) => {
            if (err) {
                alertify.error(err);
                return;
            }
            this.currentModule = data;
            this.currentModuleName = name;

            if (fs.pathExistsSync(path.join('./ct.libs', name, 'README.md'))) {
                this.currentModuleHelp = md.render(fs.readFileSync(path.join('./ct.libs', name, 'README.md'), {
                    encoding: 'utf8'
                }) || '');
            } else {
                this.currentModuleHelp = false;
            }
            if (fs.pathExistsSync(path.join('./ct.libs', name, 'DOCS.md'))) {
                this.currentModuleDocs = md.render(fs.readFileSync(path.join('./ct.libs', name, 'DOCS.md'), {
                    encoding: 'utf8'
                }) || '');
            } else {
                this.currentModuleDocs = false;
            }
            if (fs.pathExistsSync(path.join('./ct.libs', name, 'CHANGELOG.md'))) {
                this.currentModuleLogs = md.render(fs.readFileSync(path.join('./ct.libs', name, 'CHANGELOG.md'), {
                    encoding: 'utf8'
                }) || '');
            } else {
                this.currentModuleLogs = false;
            }
            if (fs.pathExistsSync(path.join('./ct.libs', name, 'LICENSE'))) {
                this.currentModuleLicense = fs.readFileSync(path.join('./ct.libs', name, 'LICENSE'), {
                    encoding: 'utf8'
                }) || '';
            } else {
                this.currentModuleLicense = false;
            }
            this.currentModule.injects = fs.pathExistsSync(path.join('./ct.libs', name, 'injects'));
            this.update();
        });
        this.tab = 'moduleinfo';
    };

    var clipboard = nw.Clipboard.get();
    var copymeMenu = new gui.Menu();
    copymeMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.copy,
        click: e => {
            clipboard.set(this.currentFragment, 'text');
        }
    }));
    copymeMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.addtonotes,
        click: e => {
            currentProject.notes += '\n' + this.currentFragment;
        }
    }));
    this.showCopyMenu = e => {
        this.currentFragment = `ct.${this.currentModuleName}.${e.item.name || e.item.parameter || e.item.method}`;
        copymeMenu.popup(e.pageX, e.pageY);
        e.preventDefault();
    };
});

riot.tag2('notepad-panel', '<ul class="nav tabs nogrow"> <li onclick="{changeTab(\'notepadlocal\')}"><i class="icon icon-edit"></i><span>{voc.local}</span></li> <li onclick="{changeTab(\'notepaglobal\')}"><i class="icon icon-clipboard"></i><span>{voc.global}</span></li> <li onclick="{changeTab(\'helppages\')}"><i class="icon icon-life-buoy"></i><span>{voc.helppages}</span></li> </ul> <div> <div show="{tab === \'notepadlocal\'}"> <div class="acer" ref="notepadlocal"></div> </div> <div show="{tab === \'notepaglobal\'}"> <div class="acer" ref="notepadglobal"></div> </div> <div show="{tab === \'helppages\'}"> <iframe src="docs/index.html" nwdisable nwfaketop></iframe> </div> </div> <button class="vertical dockleft" onclick="{notepadToggle}"><i class="icon icon-{opened? \'chevron-right\' : \'chevron-left\'}"></i></button>', '', 'class="panel dockright {opened: opened}" id="notepad"', function(opts) {
    this.opened = false;
    this.namespace = 'notepad';
    this.mixin(window.riotVoc);
    this.notepadToggle = function() {
        this.opened = !this.opened;
    };

    this.tab = 'notepadlocal';
    this.changeTab = tab => e => {
        this.tab = tab;
    };

    this.on('update', () => {
        this.notepadlocal.setValue(window.currentProject.notes || '');
    });

    this.on('mount', () => {
        setTimeout(() => {
            this.notepadlocal = window.setupAceEditor(this.refs.notepadlocal, {
                mode: 'javascript'
            });
            this.notepadglobal = window.setupAceEditor(this.refs.notepadglobal, {
                mode: 'javascript'
            });

            this.notepadlocal.getSession().on('change', (e) => {
                window.currentProject.notes = this.notepadlocal.getValue();
                window.glob.modified = true;
            });
            this.notepadglobal.getSession().on('change', (e) => {
                localStorage.notes = this.notepadglobal.getValue();
            });
            this.notepadglobal.setValue(localStorage.notes);
        }, 0);
    });
});

riot.tag2('project-selector', '<div class="stretch" id="bg"></div> <div class="modal" id="intro"> <div class="flexrow"> <div class="c4 np"></div> <div class="c8 npt npb"> <h2>{voc.latest}</h2> </div> </div> <div class="flexrow"> <div class="c4 npl npt project-selector-aPreview center"><img riot-src="{projectSplash}"></div> <div class="c8 npr npt npl flexfix"> <ul class="menu flexfix-body"> <li each="{project in lastProjects}" title="{requirePath.basename(project,\'.json\')}" onclick="{updatePreview(project)}" ondblclick="{loadRecentProject}">{project}</li> </ul> <label class="file flexfix-footer"> <input type="file" ref="fileexternal" accept=".ict" onchange="{openProjectFind}"> <div class="button wide inline"><i class="icon icon-folder"></i><span>{voc.browse}</span></div> </label> </div> </div> <div class="inset flexrow flexmiddle" id="newProject"> <div class="c4 npl npt npb"> <h3 class="nm right">{voc.newProject.text}</h3> </div> <div class="c5 np"> <input class="wide" type="text" placeholder="{voc.newProject.input}" pattern="[a-zA-Z_0-9]\\{1,\\}" ref="projectname"> </div> <div class="c3 npr npt npb"> <button class="nm wide inline" onclick="{newProject}">{voc.newProject.button}</button> </div> </div> </div>', '', '', function(opts) {
    const fs = require('fs-extra'),
          path = require('path');
    this.requirePath = path;
    this.namespace = 'intro';
    this.mixin(window.riotVoc);
    this.visible = true;
    this.projectSplash = '/img/nograph.png';

    if (('lastProjects' in localStorage) &&
        (localStorage.lastProjects !== '')) {
        this.lastProjects = localStorage.lastProjects.split(';');
    } else {
        this.lastProjects = [];
    }

    this.updatePreview = projectPath => e => {
        this.projectSplash = 'file://' + path.dirname(projectPath) + '/' + path.basename(projectPath, '.ict') + '/img/splash.png';
    };

    this.newProject = function() {
        const way = path.dirname(process.execPath).replace(/\\/g,'/') + '/projects';
        var codename = this.refs.projectname.value;
        var projectData = {
            notes: '/* empty */',
            libs: {},
            graphs: [],
            types: [],
            sounds: [],
            styles: [],
            rooms: [],
            graphtick: 0,
            soundtick: 0,
            roomtick: 0,
            typetick: 0,
            styletick: 0,
            starting: 0,
            settings: {
                minifyhtmlcss: false,
                minifyjs: false
            }
        };
        fs.writeJSON(path.join(way, codename + '.ict'), projectData, function(e) {
            if (e) {
                throw e;
            }
        });
        sessionStorage.projdir = path.join(way, codename);
        sessionStorage.projname = codename + '.ict';
        fs.ensureDir(sessionStorage.projdir);
        fs.ensureDir(sessionStorage.projdir + '/img');
        fs.ensureDir(sessionStorage.projdir + '/snd');
        fs.ensureDir(sessionStorage.projdir + '/include');
        setTimeout(() => {
            window.megacopy('./img/nograph.png', path.join(sessionStorage.projdir + '/img/splash.png'), e => {
                if (e) {
                    alertify.error(e);
                    console.error(e);
                }
            });
        }, 0);
        this.loadProject(projectData);
    };

    this.loadRecentProject = e => {
        var projectPath = e.item.project;
        fs.readJSON(projectPath, (err, projectData) => {
            if (err) {
                alertify.error(languageJSON.common.notfoundorunknown);
                return;
            }
            sessionStorage.projdir = path.dirname(projectPath) + path.sep + path.basename(projectPath, '.ict');
            sessionStorage.projname = path.basename(projectPath);
            this.loadProject(projectData);
        });
    };

    this.loadProject = projectData => {
        window.currentProject = projectData;
        fs.ensureDir(sessionStorage.projdir);
        fs.ensureDir(sessionStorage.projdir + '/img');
        fs.ensureDir(sessionStorage.projdir + '/snd');

        if (this.lastProjects.indexOf(path.normalize(sessionStorage.projdir + '.ict')) !== -1) {
            this.lastProjects.splice(this.lastProjects.indexOf(path.normalize(sessionStorage.projdir + '.ict')), 1);
        }
        this.lastProjects.unshift(path.normalize(sessionStorage.projdir + '.ict'));
        if (this.lastProjects.length > 15) {
            this.lastProjects.pop();
        }
        localStorage.lastProjects = this.lastProjects.join(';');
        glob.modified = false;

        this.parent.selectorVisible = false;
        setTimeout(() => {
            riot.update();
            this.parent.update();
        }, 0);
    };

    this.openProjectFind = e => {
        var fe = this.refs.fileexternal,
            proj = fe.value;
        if (path.extname(proj).toLowerCase() === '.ict') {
            fs.readJSON(proj, (err, projectData) => {
                if (err) {
                    alertify.error(err);
                    return;
                }
                if (!projectData) {
                    alertify.error(languageJSON.common.wrongFormat);
                    return;
                }
                console.log(projectData);
                sessionStorage.projname = path.basename(proj);
                sessionStorage.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
                this.loadProject(projectData);
            });
        } else {
            alertify.error(languageJSON.common.wrongFormat);
        }
        fe.value = '';
    };
});

riot.tag2('raw', '<span></span>', '', '', function(opts) {
    this.root.innerHTML = this.oldContent = this.opts.content;
    this.on('update', () => {
        if (this.oldContent !== this.opts.content) {
            this.root.innerHTML = this.oldContent = this.opts.content;
        }
    });
});

riot.tag2('room-editor', '<div class="toolbar borderright tall"> <div class="settings nogrow noshrink"><b>{voc.name}</b><br> <input class="wide" type="text" riot-value="{room.name}" onchange="{wire(\'this.room.name\')}"><br><b>{voc.width}</b><br> <input class="wide" riot-value="{room.width}" onchange="{wire(\'this.room.width\')}" type="{\'number\'}"><br><b>{voc.height}</b><br> <input class="wide" riot-value="{room.height}" onchange="{wire(\'this.room.height\')}" type="{\'number\'}"><br> <button class="wide" onclick="{openRoomEvents}"><i class="icon icon-confirm" if="{room.oncreate || room.onstep || room.ondestroy || room.ondraw}"></i><span>{voc.events}</span></button> </div> <div class="palette"> <div class="tabwrap"> <ul class="tabs nav noshrink nogrow"> <li class="{active: tab === \'roomcopies\'}" onclick="{changeTab(\'roomcopies\')}">{voc.copies}</li> <li class="{active: tab === \'roombackgrounds\'}" onclick="{changeTab(\'roombackgrounds\')}">{voc.backgrounds}</li> </ul> <div class="relative"> <div class="room-editor-TypeSwatches tabbed tall" show="{tab === \'roomcopies\'}"> <div class="room-editor-aTypeSwatch {active: currentType === -1}" onclick="{roomUnpickType}"><span>{window.languageJSON.common.none}</span><img src="/img/nograph.png"></div> <div class="room-editor-aTypeSwatch {active: type === currentType}" each="{type in window.currentProject.types}" title="{type.name}" onclick="{selectType(type)}"><span>{type.name}</span><img riot-src="{type.graph === -1? \'/img/nograph.png\' : \'file://\' + sessionStorage.projdir + \'/img/\' + type.graph + \'_prev.png?\' + getTypeGraphRevision(type)}"></div> </div> <div class="room-editor-Backgrounds tabbed tall" show="{tab === \'roombackgrounds\'}"> <ul> <li class="bg" each="{background, ind in room.backgrounds}" oncontextmenu="{onBgContextMenu}"><img riot-src="{background.graph === -1? \'/img/nograph.png\' : \'file://\' + sessionStorage.projdir + \'/img/\' + background.graph}" onclick="{onChangeBgGraphic}"><span onclick="{onChangeBgDepth}">{background.depth}</span></li> </ul> <button class="inline wide" onclick="{roomAddBg}"><i class="icon icon-plus"></i><span>{voc.add}</span></button> </div> </div> </div> </div> <div class="done nogrow"> <button class="wide" id="roomviewdone" onclick="{roomSave}"><i class="icon icon-confirm"></i><span>{voc.done}</span></button> </div> </div> <div class="editor" ref="canvaswrap"> <canvas ref="canvas" onclick="{onCanvasClick}" onmousedown="{onCanvasPress}" onmousemove="{onCanvasMove}" onmouseup="{onCanvasMouseUp}" onmouseout="{refreshRoomCanvas}" onmousewheel="{onCanvasWheel}" oncontextmenu="{onCanvasContextMenu}"></canvas> <div class="shift"> <button class="inline square" title="{voc.shift}" onclick="{roomShift}"><i class="icon icon-move"></i></button><span>{voc.hotkeysNotice}</span> </div> <div class="zoom"><b>{voc.zoom}</b> <div class="button-stack"> <button class="inline {active: zoomFactor === 0.25}" id="roomzoom25" onclick="{roomToggleZoom(0.25)}">25%</button> <button class="inline {active: zoomFactor === 0.5}" id="roomzoom50" onclick="{roomToggleZoom(0.5)}">50%</button> <button class="inline {active: zoomFactor === 1}" id="roomzoom100" onclick="{roomToggleZoom(1)}">100%</button> <button class="inline {active: zoomFactor === 2}" id="roomzoom200" onclick="{roomToggleZoom(2)}">200%</button> </div> </div> <div class="grid"> <button class="{active: room.grid &gt; 0}" id="roomgrid" onclick="{roomToggleGrid}"> <span>{voc[room.grid > 0? \'gridoff\' : \'grid\']}</span></button> </div> <div class="center"> <button id="roomcenter" onclick="{roomToCenter}">{voc.tocenter}</button> </div> </div> <room-events-editor if="{editingCode}" room="{room}"></room-events-editor> <graphic-selector ref="graphPicker" if="{pickingBackground}" onselected="{onBackgroundGraphSelected}"></graphic-selector>', '', 'class="panel view"', function(opts) {
    this.editingCode = false;
    this.pickingBackground = false;
    this.forbidDrawing = false;
    const fs = require('fs-extra'),
          gui = require('nw.gui');
    const win = gui.Window.get();
    this.namespace = 'roomview';
    this.mixin(window.riotVoc);
    this.mixin(window.riotWired);

    this.room = this.opts.room;

    this.roomx = this.room.width / 2
        this.roomx = this.room.width / 2;
        this.roomy = this.room.height / 2;
    this.zoomFactor = 1;
    this.room.grid = this.room.grid || 64;
    this.currentType = -1;
    this.dragging = false;
    this.tab = 'roomcopies';

    this.getTypeGraphRevision = type => window.glob.graphmap[type.graph].g.lastmod;

    var updateCanvasSize = (newWidth, newHeight) => {
        var canvas = this.refs.canvas,
            sizes = this.refs.canvaswrap.getBoundingClientRect();
        if (canvas.width != sizes.width || canvas.height != sizes.height) {
            canvas.width = sizes.width;
            canvas.height = sizes.height;
        }
        this.refreshRoomCanvas();
    };
    this.on('mount', () => {
        this.room = this.opts.room;
        this.refs.canvas.x = this.refs.canvas.getContext('2d');
        this.gridCanvas = document.createElement('canvas');
        this.gridCanvas.x = this.gridCanvas.getContext('2d');
        this.redrawGrid();
        win.on('resize', updateCanvasSize);
        updateCanvasSize();
    });
    this.on('unmount', () => {
        win.removeAllListeners('resize');
    });

    this.openRoomEvents = e => {
        this.editingCode = true;
    };

    this.roomToggleZoom = zoomFactor => e => {
        this.zoomFactor = zoomFactor;
        this.redrawGrid();
        this.refreshRoomCanvas();
    };
    this.roomToCenter = e => {
        this.roomx = this.room.width / 2;
        this.roomy = this.room.height / 2;
        this.refreshRoomCanvas();
    };
    this.redrawGrid = () => {
        this.gridCanvas.width = this.gridCanvas.height = this.room.grid;
        this.gridCanvas.x.clearRect(0, 0, this.room.grid, this.room.grid);
        this.gridCanvas.x.globalAlpha = 0.3;
        this.gridCanvas.x.strokeStyle = "#446adb";
        this.gridCanvas.x.lineWidth = 1 / this.zoomFactor;
        this.gridCanvas.x.strokeRect(0.5 / this.zoomFactor, 0.5 / this.zoomFactor, this.room.grid, this.room.grid);
    }
    this.roomToggleGrid = () => {
        if (this.room.grid === 0) {
            alertify
            .prompt(this.voc.gridsize)
            .then(e => {
                if (e.inputValue) {
                    if (Number(e.inputValue) > 1) {
                        this.room.grid = Number(e.inputValue);
                    }
                }
                this.redrawGrid();
                this.refreshRoomCanvas();
                this.update();
            });
        } else {
            this.refreshRoomCanvas();
            this.room.grid = 0;
        }
    };

    this.tab = 'roomcopies';
    this.changeTab = tab => e => {
        this.tab = tab;
        if (tab === 'roombackgrounds') {
            this.roomUnpickType();
        }
    };
    this.roomUnpickType = e => {
        this.currentType = -1;
    };
    this.selectType = type => e => {
        this.currentType = type;
    };
    var lastTypeLayer;
    var findTypeLayer = a => {
        if (a.depth === this.currentType.depth) {
            lastTypeLayer = a;
            return true;
        }
        return false;
    };

    this.xToRoom = x => (x - ~~(this.refs.canvas.width / 2)) / this.zoomFactor + this.roomx;

    this.yToRoom = y => (y - ~~(this.refs.canvas.height / 2)) / this.zoomFactor + this.roomy;

    this.xToCanvas = x => (x - this.roomx) * this.zoomFactor + ~~(this.refs.canvas.width / 2);

    this.yToCanvas = y => (y - this.roomy) * this.zoomFactor + ~~(this.refs.canvas.height / 2);

    this.onCanvasClick = e => {

        if (this.currentType === -1 || e.ctrlKey) {
            return;
        }
        var targetLayer;
        if (!this.room.layers.some(findTypeLayer)) {

            targetLayer = {
                depth: this.currentType.depth,
                copies: []
            };
            this.room.layers.push(targetLayer);

            this.room.layers.sort(function (a, b) {
                return a.depth - b.depth;
            });
        } else {
            targetLayer = lastTypeLayer;
        }

        if (this.room.grid == 0 || e.altKey) {
            targetLayer.copies.push({
                x: ~~(this.xToRoom(e.offsetX)),
                y: ~~(this.yToRoom(e.offsetY)),
                uid: this.currentType.uid
            });
        } else {
            var x = ~~(this.xToRoom(e.offsetX)),
                y = ~~(this.yToRoom(e.offsetY));
            targetLayer.copies.push({
                x: x - (x % this.room.grid),
                y: y - (y % this.room.grid),
                uid: this.currentType.uid
            });
        }
        this.refreshRoomCanvas();
    };

    this.onCanvasPress = e => {
        this.mouseDown = true;
        if (this.currentType === -1 && e.button === 0 && !e.ctrlKey) {
            this.dragging = true;
        }
    }

    this.onCanvasMouseUp = e => {
        this.mouseDown = false;
        this.dragging = false;
    };

    this.onCanvasMove = e => {
        if (this.dragging) {

            this.roomx -= ~~(e.movementX / this.zoomFactor);
            this.roomy -= ~~(e.movementY / this.zoomFactor);
            this.refreshRoomCanvas(e);
        } else if (e.ctrlKey) {

            var maxdist = this.room.grid || 64;
            if (this.mouseDown && this.room.layers.length !== 0) {
                var type = this.room.layers[0].copies[0],
                    pos = 0,
                    layer, l,
                    done = false,
                    fromx = this.xToRoom(e.offsetX),
                    fromy = this.yToRoom(e.offsetY);
                for (let i = 0, li = this.room.layers.length; i < li; i++) {
                    let layerCopies = this.room.layers[i].copies;
                    for (let j = 0, lj = layerCopies.length; j < lj; j++) {
                        let xp = layerCopies[j].x - fromx,
                            yp = layerCopies[j].y - fromy;
                        l = Math.sqrt(xp * xp + yp * yp);
                        if (l < maxdist) {
                            layer = i;
                            pos = j;
                            done = true;
                            break;
                        }
                    }
                    if (done) {
                        break;
                    }
                }
                if (done) {
                    this.room.layers[layer].copies.splice(pos, 1);
                    if (this.room.layers[layer].copies.length == 0) {
                        this.room.layers.splice(layer,1);
                    }
                }
            }

            this.refreshRoomCanvas(e);
            var x = this.refs.canvas.x;
            x.fillStyle = '#F00';
            x.strokeStyle = '#000';
            x.globalAlpha = 0.5;
            x.beginPath();
            x.arc(this.xToRoom(e.offsetX), this.yToRoom(e.offsetY), maxdist, 0, 2 * Math.PI);
            x.fill();
            x.stroke();
        } else if (this.currentType !== -1) {
            let img, graph, w, h, grax, gray;

            this.refreshRoomCanvas(e);
            this.refs.canvas.x.setTransform(this.zoomFactor, 0, 0, this.zoomFactor, 0, 0);
            this.refs.canvas.x.globalAlpha = 0.5;
            if (this.currentType.graph != -1) {
                img = window.glob.graphmap[this.currentType.graph];
                graph = img.g;
                w = graph.width;
                h = graph.height;
                grax = graph.axis[0] - graph.offx;
                gray = graph.axis[1] - graph.offy;
            } else {
                img = window.glob.graphmap[-1];
                w = h = 32;
                grax = gray = 16;
            }
            if (this.room.grid === 0 || e.altKey) {
                this.refs.canvas.x.drawImage(
                    img,
                    0, 0, w, h,
                    e.offsetX / this.zoomFactor - grax, e.offsetY / this.zoomFactor - gray, w, h);
            } else {

                dx = this.xToRoom(e.offsetX);
                dy = this.yToRoom(e.offsetY);
                w = graph.width;
                h = graph.height;
                this.refs.canvas.x.drawImage(
                    img, 0, 0, w, h,
                    this.xToCanvas(dx - dx % this.room.grid) / this.zoomFactor - grax,
                    this.yToCanvas(dy - dy % this.room.grid) / this.zoomFactor - gray,
                    w, h);
            }
        }
    };

    this.onCanvasWheel = e => {
        if (e.wheelDelta > 0) {

            if (this.zoomFactor === 1) {
                this.zoomFactor = 2;
            } else if (this.zoomFactor === 0.5) {
                this.zoomFactor = 1;
            }  else if (this.zoomFactor === 0.25) {
                this.zoomFactor = 0.5;
            }
        } else {

            if (this.zoomFactor === 2) {
                this.zoomFactor = 1;
            } else if (this.zoomFactor === 1) {
                this.zoomFactor = 0.5;
            }  else if (this.zoomFactor === 0.5) {
                this.zoomFactor = 0.25;
            }
        }
        this.redrawGrid();
        this.refreshRoomCanvas(e);
        this.update();
    };
    this.onCanvasContextMenu = e => {

        if (this.room.layers.length == 0) return false;
        var closest = this.room.layers[0].copies[0],
            pos = 0,
            length = Infinity,
            layer, l,
            fromx = this.xToRoom(e.offsetX),
            fromy = this.yToRoom(e.offsetY);
        for (let i = 0, li = this.room.layers.length; i < li; i++) {
            let layerCopies = this.room.layers[i].copies;
            for (let j = 0, lj = layerCopies.length; j < lj; j++) {
                let xp = layerCopies[j].x - fromx,
                    yp = layerCopies[j].y - fromy;
                l = Math.sqrt(xp * xp + yp * yp);
                if (l < length) {
                    length = l;
                    layer = i;
                    pos = j;
                }
            }
        }

        var copy = this.room.layers[layer].copies[pos],
            type = window.currentProject.types[glob.typemap[copy.uid]],
            graph = glob.graphmap[type.graph].g;
        this.closestType = type;
        this.closestLayer = layer;
        this.closestPos = pos;

        this.refreshRoomCanvas();
        this.refs.canvas.x.lineJoin = 'round';
        this.refs.canvas.x.strokeStyle = '#446adb';
        this.refs.canvas.x.lineWidth = 3;
        if (type.graph !== -1) {
            var left = copy.x - graph.axis[0] - 1.5,
                top = copy.y - graph.axis[1] - 1.5,
                height = graph.width + 3,
                width = + graph.height + 3;
        } else {
            var left = copy.x - 16 - 1.5,
                top = copy.y - 16 - 1.5,
                height = 32 + 3,
                width = 32 + 3;
        }
        this.refs.canvas.x.strokeRect(left, top, height, width);
        this.refs.canvas.x.strokeStyle = '#fff';
        this.refs.canvas.x.lineWidth = 1;
        this.refs.canvas.x.strokeRect(left, top, height, width);

        this.forbidDrawing = true;
        setTimeout(() => {
            this.forbidDrawing = false;
        }, 500);
        roomСanvasMenu.items[0].label = window.languageJSON.roomview.deletecopy.replace('{0}', type.name);
        roomСanvasMenu.popup(e.clientX, e.clientY);
        e.preventDefault();
    };

    roomСanvasMenu = new gui.Menu();
    roomСanvasMenu.append(new gui.MenuItem({
        label: window.languageJSON.roomview.deletecopy.replace('{0}', this.closestType),
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
        click: () => {
            this.room.layers[this.closestLayer].copies.splice(this.closestPos, 1);
            if (this.room.layers[this.closestLayer].copies.length == 0) {
                this.room.layers.splice(this.closestLayer,1);
            }
            this.refreshRoomCanvas();
        },
        key: 'Delete'
    }));

    this.roomShift = e => {
        window.alertify.confirm(`
            ${window.languageJSON.roomview.shifttext}
            <label class="block">X:
                <input id="roomshiftx" type="number" value="${this.room.grid}" />
            </label>
            <label class="block">Y:
                <input id="roomshifty" type="number" value="${this.room.grid}" />
            </label>
        `)
        .then((e, a) => {
            console.log(e, a);
            if (e.buttonClicked === 'ok') {
                var dx = Number(document.getElementById('roomshiftx').value) || 0,
                    dy = Number(document.getElementById('roomshifty').value) || 0;
                console.log(document.getElementById('roomshiftx').value, dx, dy)
                for (let i = 0, l = this.room.layers.length; i < l; i++) {
                    let layer = this.room.layers[i];
                    for (let j = 0, lj = layer.copies.length; j < lj; j++) {
                        layer.copies[j].x += dx;
                        layer.copies[j].y += dy;
                    }
                }
                this.refreshRoomCanvas();
            }
        });
    };

    this.onBackgroundGraphSelected = graph => e => {
        this.editingBackground.graph = graph.origname;
        this.pickingBackground = false;
        this.update();
        this.refreshRoomCanvas();
    };
    this.roomAddBg = function () {
        var newBg = {
            depth: 0,
            graph: -1
        };
        this.room.backgrounds.push(newBg);
        this.editingBackground = newBg;
        this.pickingBackground = true;
        this.room.backgrounds.sort(function (a, b) {
            return a.depth - b.depth;
        });
        this.update();
    };
    this.onBgContextMenu = e => {
        this.editedBg = Number(e.item.ind);
        roomBgMenu.popup(e.clientX, e.clientY);
        e.preventDefault();
    };
    var roomBgMenu = new gui.Menu();
    roomBgMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.delete,
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
        click: () => {
            this.room.backgrounds.splice(this.editedBg, 1);
            this.refreshRoomCanvas();
            this.update();
        }
    }));
    this.onChangeBgGraphic = e => {
        this.pickingBackground = true;
        this.editingBackground = e.item.background;
        this.update();
    };
    this.onChangeBgDepth = e => {
        alertify
        .defaultValue(e.item.background.depth)
        .prompt(window.languageJSON.roomview.newdepth)
        .then(ee => {
            if (ee.inputValue && Number(ee.inputValue)) {
                e.item.background.depth = ee.inputValue;
                this.room.backgrounds.sort(function (a, b) {
                    return a.depth - b.depth;
                });
                this.refreshRoomCanvas();
                this.update();
            }
        });
    };

    this.roomSave = e => {
        this.room.lastmod = +(new Date());
        this.roomGenSplash()
        .then(() => {
            window.glob.modified = true;
            this.parent.editing = false;
            this.parent.update();
        })
        .catch(err => {
            console.error(err);
            window.glob.modified = true;
            this.parent.editing = false;
            this.parent.update();
        })
    };

    this.refreshRoomCanvas = () => {
        if (this.forbidDrawing) {return;}
        var canvas = this.refs.canvas,
            sizes = this.refs.canvaswrap.getBoundingClientRect();

        if (canvas.width != sizes.width || canvas.height != sizes.height) {
            canvas.width = sizes.width;
            canvas.height = sizes.height;
        }

        canvas.x.setTransform(1,0,0,1,0,0);
        canvas.x.globalAlpha = 1;

        canvas.x.clearRect(0,0,canvas.width,canvas.height);

        canvas.x.translate(~~(canvas.width / 2), ~~(canvas.height / 2));
        canvas.x.scale(this.zoomFactor,this.zoomFactor);
        canvas.x.translate(-this.roomx, -this.roomy);
        canvas.x.imageSmoothingEnabled = !currentProject.settings.pixelatedrender;

        var hybrid = [];
        hybrid = this.room.layers.concat(this.room.backgrounds);
        hybrid.sort((a, b) => {
            if (a.depth - b.depth != 0) {
                return a.depth - b.depth;
            } else {
                if (a.copies) {
                    return 1;
                } else {
                    return -1;
                }
            }
            return 0;
        });
        if (hybrid.length > 0) {

            for (let i = 0, li = hybrid.length; i < li; i++) {
                if (hybrid[i].copies) {
                    let layer = hybrid[i];
                    for (let j = 0, lj = layer.copies.length; j < lj; j++) {
                        let copy = layer.copies[j],
                            type = window.currentProject.types[glob.typemap[copy.uid]];
                        let graph, w, h,
                            grax, gray;
                        if (type.graph != -1) {
                            graph = glob.graphmap[type.graph];
                            w = glob.graphmap[type.graph].width / glob.graphmap[type.graph].g.grid[0];
                            h = glob.graphmap[type.graph].height / glob.graphmap[type.graph].g.grid[1];
                            grax = glob.graphmap[type.graph].g.axis[0];
                            gray = glob.graphmap[type.graph].g.axis[1];
                        } else {
                            graph = glob.graphmap[-1];
                            w = h = 32;
                            grax = gray = 16;
                        }
                        canvas.x.drawImage(
                            graph,
                            0, 0, w, h,
                            copy.x - grax, copy.y - gray, w, h
                        );
                    }
                } else {
                    if (hybrid[i].graph !== -1) {
                        canvas.x.fillStyle = canvas.x.createPattern(glob.graphmap[hybrid[i].graph], 'repeat');
                        canvas.x.fillRect(
                            this.xToRoom(0), this.yToRoom(0),
                            canvas.width / this.zoomFactor, canvas.height / this.zoomFactor
                        );
                    }
                }
            }
        }

        if (this.room.grid > 1) {
            canvas.x.globalCompositeOperation = 'exclusion';
            canvas.x.fillStyle = canvas.x.createPattern(this.gridCanvas, 'repeat');
            canvas.x.fillRect(
                this.xToRoom(0), this.yToRoom(0),
                canvas.width / this.zoomFactor, canvas.height / this.zoomFactor);
            canvas.x.globalCompositeOperation = 'source-over';
        }

        canvas.x.lineJoin = "round";
        canvas.x.strokeStyle = "#446adb";
        canvas.x.lineWidth = 3;
        canvas.x.strokeRect(-1.5,-1.5,this.room.width+3,this.room.height+3);
        canvas.x.strokeStyle = "#fff";
        canvas.x.lineWidth = 1;
        canvas.x.strokeRect(-1.5,-1.5,this.room.width+3,this.room.height+3);

    };

    this.roomGenSplash = function() {
        return new Promise((accept, decline) => {
            var c = document.createElement('canvas'),
                w, h, k, size;
            c.x = c.getContext('2d');
            c.width = c.height = size = 256;
            c.x.clearRect(0, 0, size, size);
            w = this.refs.canvas.width;
            h = this.refs.canvas.height;
            if (w > h) {
                k = size / w;
            } else {
                k = size / h;
            }
            if (k > 1) k = 1;
            c.x.drawImage(
                this.refs.canvas,
                0, 0, this.refs.canvas.width, this.refs.canvas.height,
                (size - this.refs.canvas.width*k)/2, (size - this.refs.canvas.height*k)/2,
                this.refs.canvas.width*k,
                this.refs.canvas.height*k
            );
            var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            var nam = sessionStorage.projdir + '/img/r' + this.room.uid + '.png';
            fs.writeFile(nam, buf, function(err) {
                if (err) {
                    decline(err);
                } else {
                    accept(nam);
                }
            });
            var nam2 = sessionStorage.projdir + '/img/splash.png';
            fs.writeFile(nam2, buf, function(err) {
                if (err) {
                    decline(err);
                }
            });
        });
    };
});

riot.tag2('room-events-editor', '<div class="tabwrap"> <ul class="tabs nav nogrow noshrink"> <li class="{active: tab === \'roomcreate\'}" onclick="{switchTab(\'roomcreate\')}"><i class="icon icon-sun"></i><span>{voc.create}</span></li> <li class="{active: tab === \'roomstep\'}" onclick="{switchTab(\'roomstep\')}"><i class="icon icon-next"></i><span>{voc.step}</span></li> <li class="{active: tab === \'roomdraw\'}" onclick="{switchTab(\'roomdraw\')}"><i class="icon icon-edit-2"></i><span>{voc.draw}</span></li> <li class="{active: tab === \'roomleave\'}" onclick="{switchTab(\'roomleave\')}"><i class="icon icon-trash"></i><span>{voc.leave}</span></li> </ul> <div style="position: relative;"> <div class="tabbed" show="{tab === \'roomcreate\'}"> <div class="acer" ref="roomoncreate"></div> </div> <div class="tabbed" show="{tab === \'roomstep\'}"> <div class="acer" ref="roomonstep"></div> </div> <div class="tabbed" show="{tab === \'roomdraw\'}"> <div class="acer" ref="roomondraw"></div> </div> <div class="tabbed" show="{tab === \'roomleave\'}"> <div class="acer" ref="roomonleave"></div> </div> </div> </div> <button class="wide nogrow noshrink" onclick="{roomSaveEvents}"><i class="icon icon-confirm"></i><span>{voc.done}</span></button>', '', 'class="view panel"', function(opts) {
    this.namespace = 'roomview';
    this.mixin(window.riotVoc);
    this.tab = 'roomcreate';
    this.switchTab = tab => e => {
        this.tab = tab;
        if (tab === 'roomcreate') {
            this.roomoncreate.moveCursorTo(0,0);
            this.roomoncreate.clearSelection();
            this.roomoncreate.focus();
        } else if (tab === 'roomstep') {
            this.roomonstep.moveCursorTo(0,0);
            this.roomonstep.clearSelection();
            this.roomonstep.focus();
        } else if (tab === 'roomdraw') {
            this.roomondraw.moveCursorTo(0,0);
            this.roomondraw.clearSelection();
            this.roomondraw.focus();
        } else if (tab === 'roomleave') {
            this.roomonleave.moveCursorTo(0,0);
            this.roomonleave.clearSelection();
            this.roomonleave.focus();
        }
    };
    this.on('mount', e => {
        this.room = this.opts.room;
        setTimeout(() => {
            var editorOptions = {
                mode: 'javascript'
            };
            this.roomoncreate = window.setupAceEditor(this.refs.roomoncreate, editorOptions);
            this.roomonstep = window.setupAceEditor(this.refs.roomonstep, editorOptions);
            this.roomondraw = window.setupAceEditor(this.refs.roomondraw, editorOptions);
            this.roomonleave = window.setupAceEditor(this.refs.roomonleave, editorOptions);
            this.roomoncreate.session.on('change', e => {
                this.room.oncreate = this.roomoncreate.getValue();
            });
            this.roomonstep.session.on('change', e => {
                this.room.onstep = this.roomonstep.getValue();
            });
            this.roomondraw.session.on('change', e => {
                this.room.ondraw = this.roomondraw.getValue();
            });
            this.roomonleave.session.on('change', e => {
                this.room.onleave = this.roomonleave.getValue();
            });
            this.roomoncreate.setValue(this.room.oncreate);
            this.roomonstep.setValue(this.room.onstep);
            this.roomondraw.setValue(this.room.ondraw);
            this.roomonleave.setValue(this.room.onleave);

        }, 0);
    });
    this.roomSaveEvents = e => {
        this.parent.editingCode = false;
        this.parent.update();
    };
});

riot.tag2('rooms-panel', '<button id="roomcreate" onclick="{roomCreate}"><i class="icon icon-add"></i><span>{voc.create}</span></button> <ul class="cards rooms"> <li class="{starting: window.currentProject.startroom === room.uid}" each="{room in window.currentProject.rooms}" onclick="{openRoom(room)}" oncontextmenu="{menuPopup(room)}"><img riot-src="file://{sessionStorage.projdir + \'/img/r\' + room.uid + \'.png?\' + room.lastmod}"><span>{room.name}</span></li> </ul> <room-editor if="{editing}" room="{editingRoom}"></room-editor>', '', 'class="panel view"', function(opts) {
    this.namespace = 'rooms';
    this.mixin(window.riotVoc);
    this.editing = false;
    const gui = require('nw.gui'),
          fs = require('fs-extra'),
          path = require('path');
    this.roomCreate = function () {
        fs.copy('./img/nograph.png', path.join(sessionStorage.projdir + '/img/r' + (currentProject.roomtick + 1) + '.png'), () => {
            currentProject.roomtick ++;
            var newRoom = {
                name: 'room' + currentProject.roomtick,
                oncreate: '',
                onstep: '',
                ondraw: '',
                onleave: '',
                width: 800,
                height: 600,
                backgrounds: [],
                layers: [],
                uid: window.currentProject.roomtick
            };
            window.currentProject.rooms.push(newRoom);
            this.update();
        });
    };
    this.openRoom = room => e => {
        this.editingRoom = room;
        this.editing = true;
    };

    var roomMenu = new gui.Menu();
    roomMenu.append(new gui.MenuItem({
        label: this.voc.makestarting,
        click: () => {
            window.currentProject.startroom = this.editingRoom.uid;
            this.update();
        }
    }));
    roomMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.open,
        click: () => {
            this.openRoom(this.editingRoom);
        }
    }));
    roomMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.duplicate,
        click: () => {
            alertify
            .defaultValue(this.editingRoom.name + '_dup')
            .prompt(window.languageJSON.common.newname)
            .then(e => {
                if (e.inputValue != '') {
                    var newRoom = JSON.parse(JSON.stringify(this.editingRoom));
                    window.currentProject.roomtick ++;
                    newRoom.name = e.inputValue;
                    window.currentProject.rooms.push(newRoom);
                    this.currentRoomId = window.currentProject.rooms.length - 1;
                    this.editingRoom = window.currentProject.rooms[currentRoomId];
                    fs.linkSync(sessionStorage.projdir + '/img/r' + newRoom.uid + '.png', sessionStorage.projdir + '/img/r' + window.currentProject.roomtick + '.png')
                    newRoom.uid = window.currentProject.roomtick;
                    this.update();
                }
            });
        }
    }));
    roomMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.rename,
        click: () => {
            alertify
            .defaultValue(this.editingRoom.name)
            .prompt(window.languageJSON.common.newname)
            .then(e => {
                if (e.inputValue != '') {
                    var nam = e.inputValue;
                    this.editingRoom.name = nam;
                    this.update();
                }
            });
        }
    }));
    roomMenu.append(new gui.MenuItem({
        type: 'separator'
    }));
    roomMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.delete,
        click: () => {
            alertify
            .confirm(window.languageJSON.common.confirmDelete.replace('{0}', currentRoom.name))
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    var ind = window.currentProject.rooms.indexOf(this.editingRoom);
                    window.currentProject.rooms.splice(ind, 1);
                    this.update();
                }
            });
        }
    }));

    this.menuPopup = room => e => {
        this.editingRoom = room;
        roomMenu.popup(e.clientX, e.clientY);
        e.preventDefault();
    };
});

riot.tag2('root-tag', '<main-menu></main-menu> <notepad-panel></notepad-panel> <project-selector if="{selectorVisible}"></project-selector>', '', '', function(opts) {
    this.selectorVisible = true;
    window.signals.on('resetAll', () => {
        window.currentProject = false;
        this.selectorVisible = true;
        riot.update();
    });
});

riot.tag2('settings-panel', '<div class="tall"> <h1>{voc.settings}</h1> <h2>{voc.authoring}</h2><b>{voc.title}</b><br> <input id="gametitle" type="text" riot-value="{currentProject.settings.title}" onchange="{wire(\'this.currentProject.settings.title\')}"><br><b>{voc.author}</b><br> <input id="gameauthor" type="text" riot-value="{currentProject.settings.author}" onchange="{wire(\'this.currentProject.settings.author\')}"><br><b>{voc.site}</b><br> <input id="gamesite" type="text" riot-value="{currentProject.settings.site}" onchange="{wire(\'this.currentProject.settings.site\')}"> <h2>{voc.renderoptions}</h2> <label class="block"><span>{voc.framerate}</span><br> <input min="1" max="180" riot-value="{currentProject.settings.fps}" onchange="{wire(\'this.currentProject.settings.fps\')}" type="{\'number\'}"><br> </label> <label class="block"> <input type="checkbox" riot-value="{currentProject.settings.pixelatedrender}" onchange="{wire(\'this.currentProject.settings.pixelatedrender\')}"><span>{voc.pixelatedrender}</span> </label> <h2>{voc.exportparams}</h2> <label class="blocky" style="margin-right: 2.5rem;"> <input type="checkbox" riot-value="{currentProject.settings.minifyhtmlcss}" onchange="{wire(\'this.currentProject.settings.minifyhtmlcss\')}"><span>{voc.minifyhtmlcss}</span> </label> <label class="blocky"> <input type="checkbox" riot-value="{currentProject.settings.minifyjs}" onchange="{wire(\'this.currentProject.settings.minifyjs\')}"><span>{voc.minifyjs}</span> </label> </div>', '', 'class="panel view"', function(opts) {
    this.namespace = 'settings';
    this.mixin(window.riotVoc);
    this.mixin(window.riotWired);
    this.currentProject = window.currentProject;
    this.currentProject.settings.fps = this.currentProject.settings.fps || 30;
});

riot.tag2('sound-editor', '<div class="modal"><b>{voc.name}</b><br> <input class="wide" type="text" riot-value="{sound.name}" onchange="{wire(\'this.sound.name\')}"><br><br> <label class="file"> <div class="button inline"><i class="icon icon-plus"></i><span>{voc.import}</span></div> <input type="file" ref="inputsound" accept=".mp3,.ogg,.wav" onchange="{changeSoundFile}"> </label> <audio if="{sound &amp;&amp; sound.origname}" ref="audio" controls loop riot-src="file://{sessionStorage.projdir + \'/snd/\' + sound.origname + \'?\' + sound.lastmod}" onplay="{notifyPlayerPlays}"></audio><br><br> <button class="wide" onclick="{soundSave}"><i class="icon icon-confirm"></i><span>{voc.save}</span></button> </div>', '', 'class="panel view"', function(opts) {
    const path = require('path');
    this.namespace = 'soundview';
    this.mixin(window.riotVoc);
    this.mixin(window.riotWired);
    this.playing = false;
    this.sound = this.opts.sound;
    this.notifyPlayerPlays = e => {
        this.playing = true;
    };
    this.soundSave = e => {
        if (this.playing) {
            this.togglePlay();
        }
        this.parent.editing = false;
        this.parent.update();
    };
    this.togglePlay = function () {
        if (this.playing) {
            this.playing = false;
            this.refs.audio.pause();
        } else {
            this.playing = true;
            this.refs.audio.play();
        }
    };
    this.changeSoundFile = () => {
        var val = this.refs.inputsound.value;
        megacopy(val, sessionStorage.projdir + '/snd/s' + this.sound.uid + path.extname(val), e => {
            if (e) {
                console.log(e);
                alertify.error(e);
            } else {
                if (!this.sound.lastmod) {
                    this.sound.name = path.basename(val, path.extname(val));
                }
                this.sound.origname = 's' + this.sound.uid + path.extname(val);
                this.sound.lastmod = +(new Date());
                this.update();
            }
        });
        this.refs.inputsound.value = '';
    };
});

riot.tag2('sounds-panel', '<button id="soundcreate" onclick="{soundNew}"><i class="icon icon-add"></i><span>{voc.create}</span></button> <ul class="cards"> <li each="{sound in window.currentProject.sounds}" onclick="{openSound(sound)}" oncontextmenu="{popupMenu(sound)}"><span>{sound.name}</span><img src="/img/wave.png"></li> </ul> <sound-editor if="{editing}" sound="{editedSound}"></sound-editor>', '', 'class="panel view"', function(opts) {
    this.namespace = 'sounds';
    this.mixin(window.riotVoc);
    const gui = require('nw.gui');

    this.soundNew = e => {
        var newSound = {
            name: 'sound' + currentProject.soundtick,
            uid: currentProject.soundtick
        };
        window.currentProject.soundtick++;
        window.currentProject.sounds.push(newSound);
        this.openSound(newSound);
    };
    this.openSound = sound => e => {
        this.editedSound = sound;
        this.editing = true;
        this.update();
    };

    var soundMenu = new gui.Menu();
    soundMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.open,
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
        click: () => {
            this.openSound(this.editedSound);
        }
    }));
    soundMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.rename,
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
        click: () => {
            alertify
            .defaultValue(this.editedSound.name)
            .prompt(window.languageJSON.common.newname)
            .then(e => {
                if (e.inputValue) {
                    this.editedSound.name = e.inputValue;
                }
            });
        }
    }));
    soundMenu.append(new gui.MenuItem({
        type: 'separator'
    }));
    soundMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.delete,
        icon: (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
        click: () => {
            alertify
            .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedSound.name))
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    var ind = window.currentProject.sounds.indexOf(this.editedSound);
                    window.currentProject.sounds.splice(ind, 1);
                    this.update();
                }
            });
        }
    }));

    this.popupMenu = sound => e => {
        this.editedSound = sound;
        soundMenu.popup(e.clientX, e.clientY);
        e.preventDefault();
    };
});

riot.tag2('style-editor', '<div class="tall" id="styleleft"> <div class="tabwrap tall"> <ul class="nav tabs nogrow noshrink"> <li class="{active: tab === \'stylefont\'}" onclick="{changeTab(\'stylefont\')}">{voc.font}</li> <li class="{active: tab === \'stylefill\'}" onclick="{changeTab(\'stylefill\')}">{voc.fill}</li> <li class="{active: tab === \'stylestroke\'}" onclick="{changeTab(\'stylestroke\')}">{voc.stroke}</li> <li class="{active: tab === \'styleshadow\'}" onclick="{changeTab(\'styleshadow\')}">{voc.shadow}</li> </ul> <div style="overflow: auto;"> <div class="tabbed" id="stylefont" show="{tab === \'stylefont\'}"> <label> <input id="iftochangefont" type="checkbox" onchange="{styleToggleFont}" checked="{\'font\' in styleobj}"><span>{voc.active}</span> </label> <div id="stylefontinner" if="{styleobj.font}"><b>{voc.fontfamily}</b> <input class="wide" id="fontfamily" type="text" riot-value="{styleobj.font.family || \'sans-serif\'}" onchange="{wire(\'this.styleobj.font.family\')}"><br><b>{voc.fontsize}</b><br> <input class="short" id="fontsize" riot-value="{styleobj.font.size || \'12\'}" onchange="{wire(\'this.styleobj.font.size\')}" step="1" type="{\'number\'}"> <div id="fontsizeslider"></div> <label><b>{voc.fontweight}</b><br> <select riot-value="{styleobj.font.weight}" onchange="{wire(\'this.styleobj.font.weight\')}"> <option value="100">100</option> <option value="200">200</option> <option value="300">300</option> <option value="400">400</option> <option value="500">500</option> <option value="600">600</option> <option value="700">700</option> <option value="800">800</option> <option value="900">900</option> </select> </label><br> <label> <input type="checkbox" checked="{styleobj.font.italic}" onchange="{wire(\'this.styleobj.font.italic\')}"><span> {voc.italic}</span> </label><br><br><b>{voc.alignment}</b> <div class="align buttonselect"> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'top left\'}" id="topleft" onclick="{styleSetAlign(\'top left\')}"><i class="icon icon-align-left"></i></button> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'top center\'}" id="topcenter" onclick="{styleSetAlign(\'top center\')}"><i class="icon icon-align-center"></i></button> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'top right\'}" id="topright" onclick="{styleSetAlign(\'top right\')}"><i class="icon icon-align-right"></i></button> </div> <div class="align buttonselect"> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'middle left\'}" id="middleleft" onclick="{styleSetAlign(\'middle left\')}"><i class="icon icon-align-left"></i></button> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'middle center\'}" id="middlecenter" onclick="{styleSetAlign(\'middle center\')}"><i class="icon icon-align-center"></i></button> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'middle right\'}" id="middleright" onclick="{styleSetAlign(\'middle right\')}"><i class="icon icon-align-right"></i></button> </div> <div class="align buttonselect"> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'bottom left\'}" id="bottomleft" onclick="{styleSetAlign(\'bottom left\')}"><i class="icon icon-align-left"></i></button> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'bottom center\'}" id="bottomcenter" onclick="{styleSetAlign(\'bottom center\')}"><i class="icon icon-align-center"></i></button> <button class="inline {active: `${this.styleobj.font.valign} ${this.styleobj.font.halign}` === \'bottom right\'}" id="bottomright" onclick="{styleSetAlign(\'bottom right\')}"><i class="icon icon-align-right"></i></button> </div> </div> </div> <div class="tabbed" id="stylefill" show="{tab === \'stylefill\'}"> <label> <input id="iftochangefill" type="checkbox" checked="{\'fill\' in styleobj}" onchange="{styleToggleFill}"><span>{voc.active}</span> </label> <div id="stylefillinner" if="{styleobj.fill}"><b>{voc.filltype}</b><br> <label> <input type="radio" value="0" name="filltype" checked="{styleobj.fill.type == 0}" onchange="{wire(\'this.styleobj.fill.type\')}"><span>{voc.fillsolid}</span> </label><br> <label> <input type="radio" value="1" name="filltype" checked="{styleobj.fill.type == 1}" onchange="{wire(\'this.styleobj.fill.type\')}"><span>{voc.fillgrad}</span> </label><br> <label> <input type="radio" value="2" name="filltype" checked="{styleobj.fill.type == 2}" onchange="{wire(\'this.styleobj.fill.type\')}"><span>{voc.fillpattern}</span> </label><br><br> <div class="solidfill" if="{styleobj.fill.type == 0}"><b>{voc.fillcolor}</b><br> <color-input onchange="{wire(\'this.styleobj.fill.color\', true)}" color="{styleobj.fill.color}"></color-input> </div> <div class="gradientfill" if="{styleobj.fill.type == 1}"><b>{voc.fillcolor1}</b> <color-input onchange="{wire(\'this.styleobj.fill.color1\', true)}" color="{styleobj.fill.color1}"></color-input><br><b>{voc.fillcolor2}</b> <color-input onchange="{wire(\'this.styleobj.fill.color2\', true)}" color="{styleobj.fill.color2}"></color-input><br><b>{voc.fillgradtype}</b><br> <label> <input type="radio" value="2" name="fillgradtype" onchange="{wire(\'this.styleobj.fill.gradtype\')}"><span>{voc.fillhorisontal}</span> </label><br> <label> <input type="radio" value="1" name="fillgradtype" onchange="{wire(\'this.styleobj.fill.gradtype\')}"><span>{voc.fillvertical}</span> </label><br> <label> <input type="radio" value="0" name="fillgradtype" onchange="{wire(\'this.styleobj.fill.gradtype\')}"><span>{voc.fillradial}</span> </label><br><br><b>{voc.fillgradsize}</b><br> <input id="fillgradsize" name="fillgradsize" riot-value="{styleobj.fill.gradsize}" onchange="{wire(\'this.styleobj.fill.gradsize\')}" type="{\'number\'}"> <div id="gradsizeslider"></div> </div> <div class="pattern" if="{styleobj.fill.type == 2}"><b>{voc.fillpatname}</b><br> <input id="fillpatname" type="text" name="fillpatname" riot-value="{styleobj.fill.patname}" onchange="{wire(\'this.styleobj.fill.patname\')}"> <button class="inline" data-event="styleFindPattern"><i class="icon icon-search"></i><span>{voc.findpat}</span></button> </div> </div> </div> <div class="tabbed" id="stylestroke" show="{tab === \'stylestroke\'}"> <label> <input id="iftochangestroke" type="checkbox" checked="{\'stroke\' in styleobj}" onchange="{styleToggleStroke}"><span>{voc.active}</span> </label> <div id="stylestrokeinner" if="{styleobj.stroke}"><b>{voc.strokecolor}</b> <color-input onchange="{wire(\'this.styleobj.stroke.color\', true)}" color="{styleobj.stroke.color}"></color-input><br><b>{voc.strokeweight}</b><br> <input id="strokeweight" riot-value="{styleobj.stroke.weight}" onchange="{wire(\'this.styleobj.stroke.weight\')}" type="{\'number\'}"> <div id="strokeweightslider"></div> </div> </div> <div class="tabbed" id="styleshadow" show="{tab === \'styleshadow\'}"> <label> <input id="iftochangeshadow" type="checkbox" checked="{\'shadow\' in styleobj}" onchange="{styleToggleShadow}"><span>{voc.active}</span> </label> <div id="styleshadowinner" if="{styleobj.shadow}"><b>{voc.shadowcolor}</b> <color-input onchange="{wire(\'this.styleobj.shadow.color\', true)}" color="{styleobj.shadow.color}"></color-input><br><b>{voc.shadowshift}</b><br> <input class="short" id="shadowx" riot-value="{styleobj.shadow.x}" onchange="{wire(\'this.styleobj.shadow.x\')}" type="{\'number\'}">× <input class="short" id="shadowy" riot-value="{styleobj.shadow.y}" onchange="{wire(\'this.styleobj.shadow.y\')}" type="{\'number\'}"><br><br><b>{voc.shadowblur}</b><br> <input id="shadowblur" riot-value="{styleobj.shadow.blur}" onchange="{wire(\'this.styleobj.shadow.blur\')}" type="{\'number\'}"> <div id="shadowblurslider"></div> </div> </div> </div> <button class="wide nogrow noshrink" onclick="{styleSave}"><i class="icon icon-confirm"></i><span>{voc.apply}</span></button> </div> </div> <div class="tall" id="stylepreview"> <canvas width="550" height="400" ref="canvas"></canvas> </div> <graphic-selector if="{selectingGraphic}" ref="graphicselector"></graphic-selector>', '', 'class="panel view"', function(opts) {
    const fs = require('fs-extra');

    this.namespace = 'styleview';
    this.mixin(window.riotVoc);
    this.mixin(window.riotWired);
    this.styleobj = this.opts.styleobj;

    this.changingAnyColor = false;
    this.tab = 'stylefont';
    this.changeTab = tab => e => {
        this.tab = tab;
    };
    this.on('mount', e => {
        this.refs.canvas.x = this.refs.canvas.getContext('2d');
    });
    this.on('updated', e => {
        this.refreshStyleGraphic();
    });

    this.selectingGraphic = false;

    this.styleToggleFont = e => {
        if (!this.styleobj.font) {
            this.styleobj.font = {
                family: 'sans-serif',
                size: 12,
                weight: 400,
                italic: false
            };
        } else {
            delete this.styleobj.font;
        }
    };
    this.styleSetAlign = align => e => {
        var arr = align.split(' ');
        this.styleobj.font.valign = arr[0];
        this.styleobj.font.halign = arr[1];
    };
    this.styleToggleFill = () => {
        if (this.styleobj.fill) {
            delete this.styleobj.fill;
        } else {
            this.styleobj.fill = {

            };
        }
    };
    this.styleToggleStroke = function() {
        if (this.styleobj.stroke) {
            delete this.styleobj.stroke;
        } else {
            this.styleobj.stroke = {
                color: '#000000',
                weight: 1
            };
        }
    };
    this.styleToggleShadow = function() {
        if (this.styleobj.shadow) {
            delete this.styleobj.shadow;
        } else {
            this.styleobj.shadow = {
                color: '#000000',
                x: 0,
                y: 0,
                blur: 0
            };
        }
    };

    this.refreshStyleGraphic = e => {
        var canv = this.refs.canvas;
        canv.x.strokeStyle = '#000000';
        canv.x.globalAlpha = 1;
        canv.x.font = '12px sans-serif';
        canv.x.fillStyle = '#000000';
        canv.x.shadowBlur = 0;
        canv.x.shadowColor = 'none';
        canv.x.shadowOffsetX = 0;
        canv.x.shadowOffsetY = 0;
        canv.x.lineWidth = 0;
        canv.x.textBaseline = 'alphabet';
        canv.x.textAlign = 'left';

        canv.x.clearRect(0, 0, canv.width, canv.height);
        this.styleSet(canv.x);

        canv.x.save();
        canv.x.translate(100,100);
        canv.x.beginPath();
        canv.x.rect(0, 0, 100, 100);
        canv.x.fill();
        if (this.styleobj.stroke) {
            canv.x.stroke();
        }
        canv.x.restore();

        canv.x.save();
        canv.x.translate(300,100);
        canv.x.beginPath();
        canv.x.arc(50, 50, 50, 0, 2 * Math.PI);
        canv.x.closePath();
        canv.x.fill();
        if (this.styleobj.stroke) {
            canv.x.stroke();
        }
        canv.x.restore();

        canv.x.save();
        canv.x.translate(canv.width / 2, 300);
        canv.x.fillText(languageJSON.styleview.testtext, 0, 0);
        if (this.styleobj.stroke) {
            canv.x.strokeText(languageJSON.styleview.testtext, 0, 0);
        }
        canv.x.restore();
    };
    this.styleSet = function (cx) {
        if (this.styleobj.font) {
            cx.font = (this.styleobj.font.italic? 'italic ' :'') + this.styleobj.font.weight + ' '+this.styleobj.font.size + 'px ' + this.styleobj.font.family;
            cx.textBaseline = this.styleobj.font.valign;
            cx.textAlign = this.styleobj.font.halign;
        }
        if (this.styleobj.fill) {
            if (this.styleobj.fill.type == 0) {
                cx.fillStyle = this.styleobj.fill.color;
            } else if (this.styleobj.fill.type == 1) {
                var grad;
                if (!this.styleobj.fill.gradsize) {
                    this.styleobj.fill.gradsize = 50;
                    this.styleobj.fill.color1 = '#fff';
                    this.styleobj.fill.color2 = '#000';
                }
                if (this.styleobj.fill.gradtype == 0) {
                    grad = cx.createRadialGradient(
                        this.styleobj.fill.gradsize,
                        this.styleobj.fill.gradsize,
                        0,
                        this.styleobj.fill.gradsize,
                        this.styleobj.fill.gradsize,
                        this.styleobj.fill.gradsize);
                } else if (this.styleobj.fill.gradtype == 1) {
                    grad = cx.createLinearGradient(0, 0, 0, this.styleobj.fill.gradsize);
                } else {
                    grad = cx.createLinearGradient(0, 0, this.styleobj.fill.gradsize, 0);
                }
                grad.addColorStop(0, this.styleobj.fill.color1);
                grad.addColorStop(1, this.styleobj.fill.color2);
                cx.fillStyle = grad;
            } else if (this.styleobj.fill.type == 2) {
                if (this.styleobj.fill.patname != '') {
                    var imga = document.createElement('img');
                    imga.onload = function () {
                        this.styleRedrawPreview();
                    }
                    for (var i = 0; i < currentProject.graphs.length; i++) {
                        if (currentProject.graphs[i].name == this.styleobj.fill.patname) {
                            cx.img = imga;
                            imga.src = sessionStorage.projdir + '/img/' + currentProject.graphs[i].origname;
                            break;
                        }
                    }
                }
                cx.fillStyle = '#fff';
            }
        }
        if (this.styleobj.stroke) {
            cx.strokeStyle = this.styleobj.stroke.color;
            cx.lineWidth = this.styleobj.stroke.weight;
        }
        if (this.styleobj.shadow) {
            cx.shadowColor = this.styleobj.shadow.color;
            cx.shadowBlur = this.styleobj.shadow.blur;
            cx.shadowOffsetX = this.styleobj.shadow.x;
            cx.shadowOffsetY = this.styleobj.shadow.y;
        }
    };

    this.styleRedrawPreview = () => {
        var canv = this.refs.canvas;
        if (canv.x.img) {
            canv.x.fillStyle = canv.x.createPattern(canv.x.img, 'repeat');
        }
        canv.x.clearRect(0, 0, canv.width, canv.height);
        canv.x.beginPath();
        canv.x.rect(100, 100, 100, 100);
        canv.x.fill();
        if (this.styleobj.stroke) {
            canv.x.stroke();
        }
        canv.x.beginPath();
        canv.x.arc(350, 150, 50, 0, 2 * Math.PI);
        canv.x.closePath();
        canv.x.fill();
        if (this.styleobj.stroke) {
            canv.x.stroke();
        }
        canv.x.fillText(window.languageJSON.styleview.testtext, canv.width / 2, 300);
        if (this.styleobj.stroke) {
            canv.x.strokeText(window.languageJSON.styleview.testtext, canv.width / 2, 300);
        }
    };
    setTimeout(() => {
        this.styleSet(this.refs.canvas.x);
        this.styleRedrawPreview();
    }, 0);
    this.styleSave = function() {
        this.styleobj.lastmod = +(new Date());
        this.styleGenPreview(sessionStorage.projdir + '/img/' + this.styleobj.origname + '_prev@2.png', 128);
        this.styleGenPreview(sessionStorage.projdir + '/img/' + this.styleobj.origname + '_prev.png', 64).then(() => {
            this.parent.editingStyle = false;
            this.parent.update();
        });
    };

    this.styleGenPreview = function(destination, size) {
        return new Promise((accept, decline) => {
            var c = document.createElement('canvas'),
                canv = this.refs.canvas;
            c.x = c.getContext('2d');
            c.width = c.height = size;
            c.x.clearRect(0, 0, size, size);
            var transferKeys = ['lineWidth', 'fillStyle', 'strokeStyle', 'shadowColor', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY']
            for (let i = 0, l = transferKeys.length; i < l; i++) {
                c.x[transferKeys[i]] = canv.x[transferKeys[i]];
            }
            var font = this.styleobj.font;
            c.x.font = `${font.italic? 'italic ' : ''}${font.weight || 400} ${~~(size * 0.75)}px ${font.family || 'sans-serif'}`;
            c.x.fillText('Aa', size*0.05, size*0.75);
            if (this.styleobj.stroke) {
                c.x.strokeText('Aa', size*0.05, size*0.75);
            }
            var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, '');
            var buf = new Buffer(data, 'base64');
            fs.writeFile(destination, buf, function(err) {
                if (err) {
                    console.log(err);
                    decline(err);
                } else {
                    accept(destination);
                }
            });
        });
    };
    this.styleFindPattern = e => {
        this.selectingGraphic = true;
        this.update();
        this.refs.graphicselector.onselect = graph => {
            this.styleobj.fill.patname = graph.name;
            this.selectingGraphic = false;
            this.update();
        };
    };
});

riot.tag2('styles-panel', '<button id="stylecreate" onclick="{styleCreate}"><i class="icon icon-add"></i><span>{voc.create}</span></button> <ul class="cards"> <li each="{style in window.currentProject.styles}" onclick="{openStyle(style)}" oncontextmenu="{onStyleContextMenu(style)}"><span>{style.name}</span><img riot-src="file://{window.sessionStorage.projdir + \'/img/s\' + style.uid}_prev.png?{style.lastmod}"></li> </ul> <style-editor if="{editingStyle}" styleobj="{editedStyle}"></style-editor>', '', 'class="panel view"', function(opts) {
    this.editingStyle = false;

    this.namespace = 'styles';
    this.mixin(window.riotVoc);

    const gui = require('nw.gui');

    this.styleCreate = () => {
        window.currentProject.styletick ++;
        var obj = {
            name: "style" + window.currentProject.styletick,
            uid: window.currentProject.styletick,
            origname: 's' + window.currentProject.styletick
        };
        window.currentProject.styles.push(obj);
        this.editedStyle = obj;
        this.editingStyle = true;
    };
    this.openStyle = style => e => {
        this.editingStyle = true;
        this.editedStyle = style;
    };

    var styleMenu = new gui.Menu();
    this.onStyleContextMenu = style => e => {
        this.editedStyle = e.item.style;
        styleMenu.popup(e.clientX, e.clientY);
        e.preventDefault();
    };
    styleMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.open,
        icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
        click: e => {
            this.editingStyle = true;
            this.update();
        }
    }));
    styleMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.duplicate,
        icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
        click: () => {
            alertify
            .defaultValue(this.editedStyle.name + '_dup')
            .prompt(window.languageJSON.common.newname)
            .then(e => {
                if (e.inputValue !== '') {
                    var newStyle = JSON.parse(JSON.stringify(this.editedStyle));
                    window.currentProject.styletick ++;
                    newStyle.name = e.inputValue;
                    newStyle.origname = 's' + window.currentProject.styletick;
                    newStyle.uid = window.currentProject.styletick;
                    window.currentProject.styles.push(newStyle);
                    this.editedStyleId = window.currentProject.styles.length - 1;
                    this.editedStyle = newStyle;
                    this.editingStyle = true;
                    this.update();
                }
            });
        }
    }));
    styleMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.rename,
        icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
        click: () => {
            alertify
            .defaultValue(this.editedStyle.name)
            .prompt(window.languageJSON.common.newname)
            .then(e => {
                if (e.inputValue !== '') {
                    this.editedStyle.name = e.inputValue;
                    this.update();
                }
            });
        }
    }));
    styleMenu.append(new gui.MenuItem({
        type: 'separator'
    }));
    styleMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.delete,
        icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
        click: () => {
            alertify
            .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.editedStyle.name))
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    const ind = window.currentProject.styles.indexOf(this.editedStyle);
                    window.currentProject.styles.splice(ind, 1);
                    this.update();
                }
            });
        }
    }));
});

riot.tag2('type-editor', '<div class="c3 tall"> <div class="panel" id="typegraph" onclick="{changeSprite}"><img class="ohchangeme" riot-src="{type.graph === -1? \'/img/nograph.png\' : \'file://\' + sessionStorage.projdir + \'/img/\' + type.graph + \'_prev@2.png?\' + getTypeGraphRevision(type)}"> <div>{voc.change}</div> </div><b>{voc.name}</b> <input class="wide" id="typename" type="text" onchange="{wire(\'this.type.name\')}" riot-value="{type.name}"><br><b>{voc.depth}</b> <input class="wide" id="typedepth" onchange="{wire(\'this.type.depth\')}" riot-value="{type.depth}" type="{\'number\'}"><br><br> <button class="wide" id="typedone" onclick="{typeSave}"><i class="icon icon-confirm"></i><span>{voc.done}</span></button> </div> <div class="c9 tall borderleft"> <div class="tabwrap tall" style="position: relative;"> <ul class="tabs nav nogrow noshrink"> <li class="{active: tab === \'typeoncreate\'}" onclick="{changeTab(\'typeoncreate\')}" title="{voc.create}"><i class="icon icon-sun"></i><span>{voc.create}</span></li> <li class="{active: tab === \'typeonstep\'}" onclick="{changeTab(\'typeonstep\')}" title="{voc.step}"><i class="icon icon-next"></i><span>{voc.step}</span></li> <li class="{active: tab === \'typeondraw\'}" onclick="{changeTab(\'typeondraw\')}" title="{voc.draw}"><i class="icon icon-edit-2"></i><span>{voc.draw}</span></li> <li class="{active: tab === \'typeondestroy\'}" onclick="{changeTab(\'typeondestroy\')}" title="{voc.destroy}"><i class="icon icon-trash"></i><span>{voc.destroy}</span></li> </ul> <div> <div class="tabbed" id="typeoncreate" show="{tab === \'typeoncreate\'}"> <div class="acer" ref="typeoncreate"></div> </div> <div class="tabbed" id="typeonstep" show="{tab === \'typeonstep\'}"> <div class="acer" ref="typeonstep"></div> </div> <div class="tabbed" id="typeondraw" show="{tab === \'typeondraw\'}"> <div class="acer" ref="typeondraw"></div> </div> <div class="tabbed" id="typeondestroy" show="{tab === \'typeondestroy\'}"> <div class="acer" ref="typeondestroy"></div> </div> </div> </div> </div> <graphic-selector if="{selectingGraphic}" onselected="{applyGraphic}" ref="graphicselector" showempty="sure"></graphic-selector>', '', 'class="panel view flexrow"', function(opts) {
    this.namespace = 'typeview';
    this.mixin(window.riotVoc);
    this.mixin(window.riotWired);

    this.getTypeGraphRevision = type => window.glob.graphmap[type.graph].g.lastmod;

    this.type = this.opts.type;
    this.tab = 'typeoncreate';
    this.changeTab = tab => e => {
        this.tab = tab;
        if (this.tab === 'typeonstep') {
            this.typeonstep.moveCursorTo(0, 0);
            this.typeonstep.clearSelection();
            this.typeonstep.focus();
        } else if (this.tab === 'typeondraw') {
            this.typeondraw.moveCursorTo(0, 0);
            this.typeondraw.clearSelection();
            this.typeondraw.focus();
        } else if (this.tab === 'typeondestroy') {
            this.typeondestroy.moveCursorTo(0, 0);
            this.typeondestroy.clearSelection();
            this.typeondestroy.focus();
        } else if (this.tab === 'typeoncreate') {
            this.typeoncreate.moveCursorTo(0, 0);
            this.typeoncreate.clearSelection();
            this.typeoncreate.focus();
        }
    };

    this.on('mount', () => {
        var editorOptions = {
            mode: 'javascript'
        };
        setTimeout(() => {
            this.typeoncreate = window.setupAceEditor(this.refs.typeoncreate, editorOptions);
            this.typeonstep = window.setupAceEditor(this.refs.typeonstep, editorOptions);
            this.typeondraw = window.setupAceEditor(this.refs.typeondraw, editorOptions);
            this.typeondestroy = window.setupAceEditor(this.refs.typeondestroy, editorOptions);

            this.typeoncreate.setValue(this.type.oncreate);
            this.typeonstep.setValue(this.type.onstep);
            this.typeondraw.setValue(this.type.ondraw);
            this.typeondestroy.setValue(this.type.ondestroy);

            this.typeoncreate.getSession().on('change', (e) => {
                this.type.oncreate = this.typeoncreate.getValue();
            });
            this.typeonstep.getSession().on('change', (e) => {
                this.type.onstep = this.typeonstep.getValue();
            });
            this.typeondraw.getSession().on('change', (e) => {
                this.type.ondraw = this.typeondraw.getValue();
            });
            this.typeondestroy.getSession().on('change', (e) => {
                this.type.ondestroy = this.typeondestroy.getValue();
            });
            this.typeoncreate.moveCursorTo(0,0);
            this.typeoncreate.clearSelection();
            this.typeoncreate.focus();
        }, 0);
    });
    this.changeSprite = e => {
        this.selectingGraphic = true;
    };
    this.applyGraphic = graph => e => {
        if (graph === -1) {
            this.type.graph = -1;
        } else {
            this.type.graph = graph.origname;
        }
        this.selectingGraphic = false;
        this.update();
    };
    this.typeSave = e => {
        window.glob.modified = true;
        this.parent.editingType = false;
        this.parent.fillTypeMap();
        this.parent.update();
    };
});

riot.tag2('types-panel', '<button id="typecreate" onclick="{typeCreate}"><i class="icon icon-add"></i><span>{voc.create}</span></button> <ul class="cards"> <li each="{type in window.currentProject.types}" onclick="{openType(type)}" oncontextmenu="{onTypeContextMenu}"><span>{type.name}</span><img riot-src="{type.graph !== -1 ? \'file://\' + sessionStorage.projdir + \'/img/\' + type.graph + \'_prev.png?\' + getTypeGraphRevision(type) : \'/img/nograph.png\'}"></li> </ul> <type-editor if="{editingType}" type="{editedType}"></type-editor>', '', 'class="panel view"', function(opts) {
    this.namespace = 'types';
    this.mixin(window.riotVoc);
    const gui = require('nw.gui');
    this.editingType = false;

    this.on('mount', () => {
        this.fillTypeMap();
    });

    this.getTypeGraphRevision = type => window.glob.graphmap[type.graph].g.lastmod;

    this.fillTypeMap = () => {
        delete window.glob.typemap;
        window.glob.typemap = {};
        for (let i = 0; i < window.currentProject.types.length; i++) {
            window.glob.typemap[currentProject.types[i].uid] = i;
        }
    };
    this.typeCreate = e => {
        window.currentProject.typetick ++;
        var obj = {
            name: 'type' + window.currentProject.typetick,
            depth: 0,
            oncreate: '',
            onstep: 'ct.types.move(this);',
            ondraw: 'ct.draw(this);',
            ondestroy: '',
            uid: currentProject.typetick,
            graph: -1
        };
        window.currentProject.types.push(obj);
        this.openType(obj)(e);
    };
    this.openType = type => e => {
        this.editingType = true;
        this.editedType = type;
    };

    var typeMenu = new gui.Menu();
    this.onTypeContextMenu = e => {
        this.currentType = e.item.type;
        typeMenu.popup(e.clientX, e.clientY);
        e.preventDefault();
    };
    typeMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.open,
        icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
        click: () => {
            this.openType(this.currentType)();
            this.update();
        }
    }));
    typeMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.duplicate,
        icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
        click: () => {
            alertify
            .defaultValue(this.currentType.name + '_dup')
            .prompt(window.languageJSON.common.newname)
            .then(e => {
                if (e.inputValue != '') {
                    var tp = JSON.parse(JSON.stringify(this.currentType));
                    currentProject.typetick ++;
                    tp.name = e.inputValue;
                    tp.uid = currentProject.typetick;
                    currentProject.types.push(tp);
                    this.fillTypeMap();
                    this.update();
                }
            });
        }
    }));
    typeMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.rename,
        icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
        click:  () => {
            alertify
            .defaultValue(this.currentType.name)
            .prompt(window.languageJSON.common.newname)
            .then(e => {
                if (e.inputValue != '') {
                    this.currentType.name = e.inputValue;
                    this.update();
                }
            });
        }
    }));
    typeMenu.append(new gui.MenuItem({
        type: 'separator'
    }));
    typeMenu.append(new gui.MenuItem({
        label: window.languageJSON.common.delete,
        icon: (window.isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
        click: () => {
            alertify
            .confirm(window.languageJSON.common.confirmDelete.replace('{0}', this.currentType.name))
            .then(e => {
                if (e.buttonClicked === 'ok') {
                    let ind = window.currentProject.types.indexOf(this.currentType);
                    window.currentProject.types.splice(ind, 1);
                    this.fillTypeMap();
                    this.update();
                }
            });
        }
    }));
});