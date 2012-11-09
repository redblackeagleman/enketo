/*
 Copyright 2012 Martijn van de Rijdt

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
var gui,printO,DEFAULT_SETTINGS={};$(document).ready(function(){gui=new GUI;gui.init();"undefined"==typeof console&&(console={log:function(){}});"undefined"==typeof window.console.debug&&(console.debug=console.log);"true"!==getGetVariable("debug")&&(window.console.log=function(){},window.console.debug=function(){});printO=new Print});function GUI(){}
GUI.prototype.init=function(){this.nav.setup();this.pages().init();this.setEventHandlers();"function"===typeof this.setCustomEventHandlers&&this.setCustomEventHandlers();$(".dialog [title]").tooltip({});Modernizr.borderradius&&(Modernizr.boxshadow&&Modernizr.csstransitions&&Modernizr.opacity)&&$(document).trigger("browsersupport","fancy-visuals");$("footer").detach().appendTo("#container");this.display()};GUI.prototype.setup=function(){$(window).trigger("resize")};
GUI.prototype.setEventHandlers=function(){var b=this;$("#feedback-bar .close").click(function(a){a.preventDefault();b.hideFeedback()});$("#page a.close").click(function(a){a.preventDefault();b.pages().close()});$(document).on("click",'a[href^="#"]:not([href="#"]):not(nav ul li a)',function(a){var b=$(this).attr("href");console.log("captured click to nav page, href="+b);"#"!==b&&(a.preventDefault(),$('nav li a[href="'+b+'"]').click())});$('nav ul li a[href^="#"]').click(function(a){a.preventDefault();
a=$(this).attr("href").substr(1);b.pages().open(a);$(this).closest("li").addClass("active")});$(window).on("onlinestatuschange",function(a,c){b.updateStatus.connection(c)});$(document).on("edit","form.jr",function(a,c){b.updateStatus.edit(c)});$(document).on("browsersupport",function(a,c){b.updateStatus.support(c)});$("#page, #feedback-bar").on("change",function(){b.display()});$("header #status-connection").click(function(a){b.showFeedback($(this).attr("title"));a.stopPropagation()});$(window).resize(function(){$("#container").css("top",
$("header").outerHeight());$("body:not(.no-scroll) #container").height($(window).height()-$("header").outerHeight()-$("#form-controls.bottom").outerHeight())})};
GUI.prototype.nav={setup:function(){$("article.page").each(function(){var b,a="",c;c=$(this).attr("id");b=$(this).attr("data-display")?$(this).attr("data-display"):c;a=$(this).attr("data-title")?$(this).attr("data-title"):c;c=$(this).attr("data-ext-link")?$(this).attr("data-ext-link"):"#"+c;$('<li class=""><a href="'+c+'" title="'+a+'" >'+b+"</a></li>").appendTo($("nav ul"))})},reset:function(){$("nav ul li").removeClass("active")}};
GUI.prototype.pages=function(){this.init=function(){this.$pages=$("<pages></pages>");$("article.page").detach().appendTo(this.$pages)};this.get=function(b){var a=this.$pages.find('article[id="'+b+'"]');return a=0<a.length?a:$('article[id="'+b+'"]')};this.isShowing=function(b){return 0<$("#page article.page"+("undefined"!==typeof b?'[id="'+b+'"]':"")).length};this.open=function(b){if(!this.isShowing(b)){b=this.get(b);if(1!==b.length)return console.error("page not found");this.isShowing()&&this.close();
$("#page .content").prepend(b.show()).trigger("change");$(window).bind("resize.pageEvents",function(){$("#page").trigger("change")})}};this.close=function(){var b;b=$("#page .page").detach();this.$pages.append(b);$("#page").trigger("change");this.nav.reset();$("#overlay").hide();$("#overlay, header").unbind(".pageEvents");$(window).unbind(".pageEvents")};return this};
GUI.prototype.showFeedback=function(b,a){var c,a=a?1E3*a:1E4;$("#feedback-bar p").eq(1).remove();$("#feedback-bar p").html()!==b&&(c=$("<p></p>"),c.text(b),$("#feedback-bar").append(c));$("#feedback-bar").trigger("change");setTimeout(function(){typeof c!=="undefined"&&c.remove();$("#feedback-bar").trigger("change")},a)};GUI.prototype.hideFeedback=function(){$("#feedback-bar p").remove();$("#feedback-bar").trigger("change")};
GUI.prototype.alert=function(b,a,c){var d=$("#dialog-alert"),c=c||"error",c="normal"===c?"":"alert alert-block alert-"+c;d.find(".modal-header h3").text(a||"Alert");d.find(".modal-body p").removeClass().addClass(c).html(b).capitalizeStart();d.modal({keyboard:!0,show:!0});d.on("hidden",function(){d.find(".modal-header h3, .modal-body p").html("")})};
GUI.prototype.confirm=function(b,a){var c,d,f,g,e;"string"===typeof b?c=b:"string"===typeof b.msg&&(c=b.msg);c="undefined"!==typeof c?c:"Please confirm action";d="undefined"!==typeof b.heading?b.heading:"Are you sure?";f="undefined"!==typeof b.errorMsg?b.errorMsg:"";g="undefined"!==typeof b.dialog?b.dialog:"confirm";a="undefined"!==typeof a?a:{};a.posButton=a.posButton||"Confirm";a.negButton=a.negButton||"Cancel";a.posAction=a.posAction||function(){return false};a.negAction=a.negAction||function(){return false};
a.beforeAction=a.beforeAction||function(){};e=$("#dialog-"+g);e.find(".modal-header h3").text(d);e.find(".modal-body .msg").html(c).capitalizeStart();e.find(".modal-body .alert-error").html(f);e.modal({keyboard:!0,show:!0});e.on("shown",function(){a.beforeAction.call()});e.find("button.positive").on("click",function(){a.posAction.call();e.modal("hide")}).text(a.posButton);e.find("button.negative").on("click",function(){a.negAction.call();e.modal("hide")}).text(a.negButton);e.on("hide",function(){e.off("shown hidden hide");
e.find("button.positive, button.negative").off("click")});e.on("hidden",function(){e.find(".modal-body .msg, .modal-body .alert-error, button").text("")})};
GUI.prototype.updateStatus={connection:function(b){console.log("updating online status in menu bar to:");console.log(b);!0===b?($("header #status-connection").removeClass().addClass("ui-icon ui-icon-signal-diag").attr("title","It appears there is currently an Internet connection available."),$(".drawer #status").removeClass("offline waiting").text("")):!1===b?($("header #status-connection").removeClass().addClass("ui-icon ui-icon-cancel").attr("title","It appears there is currently no Internet connection"),
$(".drawer #status").removeClass("waiting").addClass("offline").text("Offline. ")):$(".drawer #status").removeClass("offline").addClass("waiting").text("Waiting. ")},edit:function(b){b?$("header #status-editing").removeClass().addClass("ui-icon ui-icon-pencil").attr("title","Form is being edited."):$("header #status-editing").removeClass().attr("title","")},support:function(b){var a=gui.pages().get("settings");0<a.length&&(console.debug("updating browser support for "+b),a.find("#settings-browserSupport-"+
b+" span.ui-icon").addClass("ui-icon-check"))},offlineLaunch:function(b){$(".drawer #status-offline-launch").text(b?"Offline Launch: Yes":"Offline Launch: No")}};
GUI.prototype.display=function(){var b,a;a=$("header");var c=$("#feedback-bar"),d=$("#page");0<c.find("p").length?(b=a.outerHeight(),a=this.pages().isShowing()?a.outerHeight()+c.outerHeight():a.outerHeight()+c.outerHeight()-d.outerHeight()):(b=a.outerHeight()-c.outerHeight(),a=this.pages().isShowing()?a.outerHeight():a.outerHeight()-d.outerHeight());c.css("top",b);d.css("top",a)};
GUI.prototype.setSettings=function(b){var a,c=this;console.log("gui updateSettings() started");$.each(b,function(b,f){a=f?c.pages().get("settings").find('input[name="'+b+'"][value="'+f+'"]'):c.pages().get("settings").find('input[name="'+b+'"]');0<a.length&&a.attr("checked",f?!0:!1).trigger("change")})};function getGetVariable(b){for(var a=window.location.search.substring(1).split("&"),c=0;c<a.length;c++){var d=a[c].split("=");if(d[0]==b)return encodeURI(d[1])}return!1}
function Print(){this.setStyleSheet();if("undefined"!==typeof window.onbeforeprint)$(window).on("beforeprint",this.printForm)}Print.prototype.setStyleSheet=function(){this.styleSheet=this.getStyleSheet();this.$styleSheetLink=$('link[media="print"]:eq(0)')};Print.prototype.getStyleSheet=function(){for(var b=0;b<document.styleSheets.length;b++)if("print"===document.styleSheets[b].media.mediaText)return document.styleSheets[b];return null};
Print.prototype.styleToAll=function(){this.styleSheet||this.setStyleSheet();this.styleSheet.media.mediaText="all";this.$styleSheetLink.attr("media","all")};Print.prototype.styleReset=function(){this.styleSheet.media.mediaText="print";this.$styleSheetLink.attr("media","print")};Print.prototype.printForm=function(){console.debug("preparing form for printing");this.styleToAll();this.addPageBreaks();this.styleReset();window.print()};Print.prototype.addPageBreaks=function(){};
(function(b){b.fn.equalWidth=function(){var a=0;return this.each(function(){b(this).width()>a&&(a=b(this).width())}).each(function(){b(this).width(a)})};b.fn.reverse=[].reverse;b.fn.alphanumeric=function(a){a=b.extend({ichars:"!@#$%^&*()+=[]\\';,/{}|\":<>?~`.- ",nchars:"",allow:""},a);return this.each(function(){a.nocaps&&(a.nchars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ");a.allcaps&&(a.nchars+="abcdefghijklmnopqrstuvwxyz");for(var c=a.allow.split(""),d=0;d<c.length;d++)-1!=a.ichars.indexOf(c[d])&&(c[d]="\\"+
c[d]);a.allow=c.join("|");var f=a.ichars+a.nchars,f=f.replace(RegExp(a.allow,"gi"),"");b(this).keypress(function(a){var b;b=a.charCode?String.fromCharCode(a.charCode):String.fromCharCode(a.which);f.indexOf(b)!=-1&&a.preventDefault();a.ctrlKey&&b=="v"&&a.preventDefault()});b(this).bind("contextmenu",function(){return false})})};b.fn.numeric=function(a){var c="abcdefghijklmnopqrstuvwxyz",c=c+c.toUpperCase(),a=b.extend({nchars:c},a);return this.each(function(){b(this).alphanumeric(a)})};b.fn.alpha=function(a){a=
b.extend({nchars:"1234567890"},a);return this.each(function(){b(this).alphanumeric(a)})};b.fn.capitalizeStart=function(a){a||(a=1);var b=this.contents().filter(function(){return 3==this.nodeType}).first(),d=b.text(),a=d.split(" ",a).join(" ");b.length&&(b[0].nodeValue=d.slice(a.length),b.before('<span class="capitalize">'+a+"</span>"))}})(jQuery);