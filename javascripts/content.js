var title, excerpt, content,article_url,author,reading_time,tag_list, lastLogTime;

// Settings
var reader_ext_theme = "custom-theme";
var reader_ext_font_family = "Arial";
var reader_ext_font_size = 16;
var reader_ext_line_height = 1;
var reader_ext_letter_space = 0;
var reader_ext_max_width = 680;
var reader_ext_margin = 29;
var reader_ext_default_css = `
  #reader-ext-body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
  }

  #reader-ext-body a{
    text-decoration: none;
  }

  #reader-ext-meta{
  }

  #reader-ext-outline{
    width: 250px;
    position: fixed;
    top: 65px;
    left: 30px;
  }

  #reader-ext-content-wrapper a{
    text-decoration: underline;
  }

  h1#reader-ext-title,
  #reader-ext-content h1,
  #reader-ext-content h2,
  #reader-ext-content h3,
  #reader-ext-content h4,
  #reader-ext-content h5,
  #reader-ext-content h6 {
    font-weight: 700;
    line-height: 1.3em;
    font-family: inherit;
    margin-top: 1.6em;
    margin-bottom: 0.8em;
  }
  #reader-ext-content #reader-ext-title{
    margin-top: 40px;
  }
  #reader-ext-content p{
    word-break: break-word;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }
  #reader-ext-content figure{
    padding: 0;
    margin: 0;
  }
  #reader-ext-content img{
    max-width: 100% !important;
    height: auto !important;
    margin: 30px auto;
    display: block;
  }
  #reader-ext-content table{
    border-spacing: 0px;
    border-collapse: collapse;
  }
  #reader-ext-content table td, #reader-ext-content table th {
    text-align: left;
    font-size: 14px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(229, 229, 229);
    border-image: initial;
    padding: 17px;
  }
  #reader-ext-content blockquote {
    text-decoration: none;
    opacity: 0.7;
  }
  #reader-ext-content blockquote:before {
    content: '\e244';
    font-family: 'Material Icons';
    float: left;
    font-size: 350%;
    font-style: normal;
    font-weight: normal;
    line-height: 0.6;
    opacity: 0.2;
  }

  /* Customize the scrollbar track */
  ::-webkit-scrollbar {
    width: 12px;
  }
  
  /* Customize the scrollbar handle */
  ::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 6px;
  }
  
  /* Customize the scrollbar track on hover */
  ::-webkit-scrollbar-track:hover {
    background-color: transparent;
  }
`;
var reader_ext_background_color_light = "#FFFFFF";
var reader_ext_text_color_light = "#333333";
var reader_ext_link_color_light = "#5F6368";
var reader_ext_background_color_dark = "#35363a";
var default_background_color_dark = "#35363a"
var default_background_color_light = "#e6e6e6"
var default_text_color_light = "#333333";
var default_link_color_light = "#5F6368"
var default_text_color_dark = "#E0E0E0"
var default_linkcolor_dark = "#FFFFFF"
var reader_ext_foreground_color_light = "#e6e6e6"
var reader_ext_foreground_color_dark = "#464545"
var reader_ext_background_w_color_dark = "#464545"
var default_foreground_color_light = "#FFFFFF"
var default_foreground_color_dark = "#464545"
var reader_ext_text_color_dark = "#E0E0E0";
var reader_ext_link_color_dark = "#FFFFFF";
var reader_ext_background_color = "#F8F1E3";
var reader_ext_foreground_color = "#FFFFFF"
var reader_ext_text_color = "#333333";
var reader_ext_link_color = "#5F6368";
var reader_ext_theme;
var reader_ext_theme_sync;
var reader_ext_dark_panel = "on";
var reader_ext_display_footer = "on";
var reader_ext_display_outline = "off";
var reader_ext_display_images = "on";
var reader_ext_display_meta = "on";
var reader_ext_display_author = "on";
var reader_ext_display_reading_time = "on";

var font_family_changed;
var font_size_changed;
var line_height_changed;
var letter_space_changed;
var max_width_changed;
var margin_changed

var background_color_changed;
var foreground_color_changed;
var text_color_changed;
var link_color_changed;
var theme_sync_changed;

var dark_panel_changed;
var footer_changed;
var outline_changed;
var images_changed;
var meta_changed;
var author_changed;
var read_time_changed;

var previousDarkPanel;
var previousFooter;
var previousOutline;
var previousImages;
var previousMeta;
var previousAuthor;
var previousReadTime;
var previousThemeSync;

var previousLinkColor;
var previousTextColor;
var previousForegroundColor;
var previousBackgroundColor;

var previousFontFamily;
var previousFontSize;
var previousLineHeight;
var previousLetterSpace;
var previousMaxWidth;
var previousMargin;

var tempThemeSync;
var tempLastTheme='custom-theme';
var tempDarkPanel;

function showPalette(show, doc){
  if(!show){
    $(doc).find("#options-background-color").hide();
    $(doc).find("#options-foreground-color").hide();
    $(doc).find("#options-text-color").hide();
    $(doc).find("#options-link-color").hide();
  }

  else if(show){
      $(doc).find("#options-background-color").show();
      $(doc).find("#options-foreground-color").show();
      $(doc).find("#options-text-color").show();
      $(doc).find("#options-link-color").show();
  }
};

// Copy to clipboard
function media_clipboard(doc, item){
  $(doc).find(item).click(function(){
    let str = $(this).attr('data-clipboard-text');
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    btn_clipboard_copy = $(doc).find(item+" .fa-copy");
    $("<span class='btn-clipboard-copied'>Copied!</span>").insertBefore( btn_clipboard_copy ).fadeOut(1000, function() { $(this).remove() });
  });
}

// Tag fields
function init_tags(doc, item){
  $(doc).find(item).tagit({
    placeholderText: "Tags...",
    availableTags: ["read-it-later", "research"],
    //tagLimit: 5,
    onTagLimitExceeded: function(event, ui){
      //$(".tag-limit-alert").show();
    },
    afterTagRemoved: function(event, ui){
      tag_list = $(doc).find(item).val();
    }
  });
}

// Check if string is empty
function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

// Toggle display outline
function outlineDisplayToggle(doc) {
  var outline = $(doc).find("#reader-ext-outline");

  // Hide Sidebar when the first page reload if mobile
  var width = $(window).width();

  if(width <= 1280){
    $(outline).hide();
    $(outline).css('width', '0');
  } else {
    $(outline).show();
    outline.css('width', '250px');
  }

  // Hide Sidebar when the first page reload if resized
  $(window).resize(function() {
    width = $(window).width();
    if(width <= 1280){
      $(outline).hide();
      $(outline).css('width', '0');
    } else {
      $(outline).show();
      $(outline).css('width', '250px');
    }
  });
}


// Return preloader html
function getPreloader(){
  var preloader = `<div id='reader-ext-pre-loader' style='
      width: 250px;
      height: 100px;
      text-align: center;
      font-family: "Helvetica Neue";
      font-weight: 200;
      color:rgb(56, 56, 56);
      letter-spacing: 0.5;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%); /* for IE 9 */
      -webkit-transform: translate(-50%, -50%); /* for Safari */
    '>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.95);box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3); }
          70% { transform: scale(1);box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
          100% { transform: scale(0.95);box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
        }
      </style>
      <div class="blobs-container text-center" style="margin: 0px auto;margin-bottom: 30px;width: 50px;">
        <div class="blob" style="
          background: #dddddd;
          border-radius: 50%;
          margin: 10px;
          height: 20px;
          width: 20px;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
          transform: scale(1);
          animation: pulse 2s infinite;"
        >
        </div>
      </div>
      <p>Loading...</p>
    </div>`;

  return preloader
}

function rateLimitLog(message, val) {
  const currentTime = Date.now();
  
  if (currentTime - lastLogTime >= 1000) { // Check if one second has passed
    lastLogTime = currentTime; // Update last log time
  }
  else if(lastLogTime == null){
    lastLogTime = 0;
  }
}


// Added pre-loader
function startPreloader(doc){
  //pulse_preloader_url = chrome.runtime.getURL('assets/images/pulse-preloader.svg');
  preloader = getPreloader();
  $(doc).find("body").prepend(preloader);
}



/* Get HTML Of Selected Text */
function getHTMLOfSelection () {
  var range;
  if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    return range.htmlText;
  }
  else if (window.getSelection) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      var clonedSelection = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(clonedSelection);
      return div.innerHTML;
    }
    else {
      return '';
    }
  }
  else {
    return '';
  }
}

// Parse the article
function getParsedArticle(){
  var loc = document.location;
  var uri = {
    spec: loc.href,
    host: loc.host,
    prePath: loc.protocol + "//" + loc.host,
    scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
    pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
  };

  var doc_to_parse;

  selected_text = getHTMLOfSelection();
  if(selected_text != "") {
    doc_to_parse = new DOMParser().parseFromString(selected_text, "text/html");
  } else {
    /*
    * Readability's parse() works by modifying the DOM. This removes some elements in the web page.
    * So to avoid this, we are passing the clone of the document object while creating a Readability object.
    */
    doc_to_parse = document.cloneNode(true);
  }

  var article = new Readability(uri, doc_to_parse).parse();

  return article;
}

// Remove unnecassary stuffs from content
function trimContent(doc){
  $(doc).find("#reader-ext-content span:contains('Image copyright')").css("display","none");
  $(doc).find("#reader-ext-content figcaption").css("display","none");
}

// Turn title/text into url friendly slug
function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Set Outline list
function setOutline(doc, article) {
  if (article.title && article.title != "") {
    $(doc).find("#reader-ext-outline-list").append("<li><a href='#reader-ext-title'>"+article.title+"</a></li>");
  }
  $(article.content).find("h1, h2, h3, h4, h5, h6").each(function(){
    var heading = $(this).text();
    var slug = slugify(heading);
    $(doc).find("#reader-ext-outline-list").append("<li><a href='#"+slug+"'>"+heading+"</a></li>");
  });
}

// Set slug to headings for outline list
function setHeadingsForOutline(doc){
  $(doc).find("h1, h2, h3, h4, h5, h6").each(function(){
    var heading = $(this).text();
    var slug = slugify(heading);

    if ( $(this).attr("id") != "reader-ext-title" ) {
      $(this).attr("id", slug)
    }
  });
}

// Add styletag to iframe
function addStyleTags(doc){
  style_url = chrome.runtime.getURL("styles/content.css");
  $(doc).find('head').append("<link rel='stylesheet' type='text/css' href='"+style_url+"'>");

  style_url = chrome.runtime.getURL("styles/base.css");
  $(doc).find('head').append("<link rel='stylesheet' type='text/css' href='"+style_url+"'>");

  style_url = chrome.runtime.getURL("styles/options-panel.css");
  $(doc).find('head').append("<link rel='stylesheet' type='text/css' href='"+style_url+"'>");

  style_url = chrome.runtime.getURL("styles/boxicons-2.1.4/css/boxicons.css");
  $(doc).find('head').append("<link rel='stylesheet' type='text/css' href='"+style_url+"'>");

  style_url = chrome.runtime.getURL("styles/tag-it.css");
  $(doc).find('head').append("<link rel='stylesheet' type='text/css' href='"+style_url+"'>");

  style_url = chrome.runtime.getURL("styles/semantic.css");
  $(doc).find('head').append("<link rel='stylesheet' type='text/css' href='"+style_url+"'>");
}

//Get status from checkbox
function getCheckboxStatus(checkbox){
  var status;
  if ($(checkbox).is(':checked')) { status = "on"; } else { status = "off"; }
  return status;
}

/*** Scrolling ***/
var scrolling = false;
function startStopScrolling(doc){
  start_btn = $(doc).find("#options-manual-scroll .start");
  stop_btn = $(doc).find("#options-manual-scroll .stop");
  speed = parseInt( $(doc).find("#options-scroll-speed input").val() );

  if (scrolling == false) {
    $(doc).find('html, body').animate({scrollTop:$(doc).height()}, speed);

    $(start_btn).hide();
    $(stop_btn).show();
    scrolling = true;
  } else {
    $(doc).find("body").stop();
    $(start_btn).show();
    $(stop_btn).hide();
    scrolling = false;
  }
}
function optionsManualScroll(doc){
  $(doc).find("#options-manual-scroll").click(function(){
    startStopScrolling(doc);
  });
}


/*** Delete & Undo Deleted Element ***/
var deleted_elements = [];
var last_element;
function startDeleteElement(doc) {
  var content_container = $(doc).find("#reader-ext-content-container");
  var mouseFunc = function (e) {
    var selected = e.target;

    if (last_element != selected)  {
      if (last_element != null) {
        $(last_element).removeClass("deletion-mode-hovered");
      }

      $(selected).addClass("deletion-mode-hovered");
      last_element = selected;
    }
  }, clickFunc = function(e) {
    e.preventDefault();

    selected = e.target;
    $(selected).removeClass("deletion-mode-hovered");

    let actionObj;
    let parent = selected.parentNode;
    actionObj = {
      "type": "delete",
      "index": Array.from(parent.children).indexOf(selected),
      "parent": parent,
      "elem": parent.removeChild(selected)
    };
    deleted_elements.push(actionObj);
    $(doc).find("#options-delete-element-undo").show();
  }, escFunc = function(e) {
    // Listen for the "Esc" key and exit if so
    if(e.keyCode === 27) {
      exitFunc();
    }
  }, exitFunc = function() {
    $(content_container).off('mouseover', mouseFunc);
    $(content_container).off('click', clickFunc);
    $(doc).off('keydown', escFunc);

    $(doc).find(".deletion-mode-hovered").removeClass("deletion-mode-hovered");
    $(doc).find("#options-delete-element").show();
    $(doc).find("#options-delete-element-stop").hide();
  }

  $(content_container).on('mouseover', mouseFunc);
  $(content_container).on('click', clickFunc);
  $(doc).on('keydown', escFunc);

  $(doc).find("#options-delete-element-stop").click(function(){
    exitFunc();
  });
}
function undoDeletedElement(doc) {
  let actionObj = deleted_elements.pop();

  if(actionObj) {
    actionObj.parent.insertBefore(actionObj.elem, actionObj.parent.children[actionObj.index]);
  }

  if(deleted_elements.length === 0) {
    $(doc).find("#options-delete-element-undo").hide();
  }
}

/*** Toolbar ***/
var selection;
var selectedContent;
var range;
var rect;
function toolbarDisplayToggle(doc) {
  $(doc).find("#reader-ext-content-container").mouseup(function(event) {
    selection = doc.getSelection();

    if ( (selection.type === 'Range') &&
      !$(event.target).hasClass("tlite") &&
      !$(event.target).hasClass("no-close") &&
      ( $(event.target).attr("id") != "reader-ext-toolbar-note-form-textarea" )
    ) {
      selectedContent = selection.toString();
      range = selection.getRangeAt(0).cloneRange();
      rect = range.getBoundingClientRect();

      showToolbar(rect, doc);
    } else {
      var toolbar_id = "reader-ext-toolbar";
      var parent = $(event.target).parent();
      if ( ($(event.target).attr("id") != toolbar_id) &&
        ($(parent).attr("id") != toolbar_id) &&
        ($(parent).parent().attr("id") != toolbar_id)
      ) {
        $(doc).find("#reader-ext-toolbar").hide();
        $(doc).find("#reader-ext-toolbar-note-form").hide();
      }
    }
  });
}
function showToolbar(rect, doc) {
  // toolbar element only create once
  var toolbar = doc.getElementById("reader-ext-toolbar");

  // caculate the position of toolbar
  var toolbarWidth = toolbar.offsetWidth;
  var toolbarHeight = toolbar.offsetHeight;
  //toolbar.style.left = `${(rect.right - rect.left) / 2 + rect.left - toolbarWidth / 2}px`;
  //toolbar.style.top = `${rect.top - toolbarHeight - 4 + doc.body.scrollTop}px`;

  //toolbar.style.top = `${rect.top - toolbarHeight - 50 + doc.body.scrollTop}px`;
  //toolbar.style.left = `calc(${rect.left}px - 30%)`;

  //toolbar.style.top = $(selection).offset().top + "px";
  //toolbar.style.left = ($(selection).offset().right + $(this).width()) + "px";

  toolbar.style.left = (window.pageXOffset + rect.x + (rect.width - $(toolbar).width()) / 2)/2;
  toolbar.style.top = `${rect.top - toolbarHeight - 50 + doc.body.scrollTop}px`;

  $(toolbar).show();
}
function toolbarNoteFormToggle(doc){
  $(doc).find("#reader-ext-toolbar-note").click(function(e){
    $(doc).find("#reader-ext-toolbar-note-form").toggle();
  });
}
function toolbarActionsHandler(doc){
  

  // Translate
  $(doc).find("#reader-ext-toolbar-translate").click(function(){
    if (selectedContent != ""){
      translateText(doc, selectedContent);
    } else {
      alert("Text cannot be empty!");
    }
  });

  // Search
  $(doc).find("#reader-ext-toolbar-search").click(function(){
    if (selectedContent != ""){
      searchText(selectedContent);
    } else {
      alert("Text cannot be empty!");
    }
  });

  // Share to Twitter
  $(doc).find("#reader-ext-toolbar-share-twitter").click(function(){
    if (selectedContent != ""){
      shareTwitter(selectedContent);
    } else {
      alert("Text cannot be empty!");
    }
  });
}

// Toggle accordian content
function optionsAccordian(doc){
  $(doc).find("#options-main-panel .options-panel-header").click(function(){
    if ( $(this).next().is(":visible") ) {
      original_state = "visible";
    } else {
      original_state = "hidden";
    }

    $(doc).find("#options-main-panel .options-panel-header").removeClass("active");
    $(doc).find("#options-main-panel .options-panel-content").removeClass("active");
    $(doc).find("#options-main-panel .options-panel-content").hide();

    if ( original_state == "visible" ) {
      $(this).removeClass("active");
      $(this).next().removeClass("active");
      $(this).next().slideUp(500);
    } else {
      $(this).addClass("active");
      $(this).next().addClass("active");
      $(this).next().slideDown(500);
    }
  });
}

// Colorpicker input field handler
function optionsColorPicker(doc){
  $(doc).on('change', 'input[type=color]', function() {
    $(this.parentNode).next().val($(this).val());
    this.parentNode.style.backgroundColor = this.value;
  });
}

function readingTime(text) {
  var wordsPerMinute = 200;
  var noOfWords = text.split(/\s/g).length;
  var minutes = noOfWords / wordsPerMinute;
  var readTime = Math.ceil(minutes);
  //var `${readTime} minute read`;
  //if (readTime == 0) || (readTime == 1) {
  //  return readTime + " minute read";
  //} else{
  //  return readTime + " minutes read";
  //}

  return readTime;
}

function shareTwitter(text) {
  var twitter_url = "https://twitter.com/intent/tweet?text=";
  var current_url = window.location.href;
  selectedText = text;
  selectedText = encodeURIComponent(text);
  var share_text = '"'+selectedText+'" - ' + current_url + ' via @readermode';
  popupwindow(twitter_url + share_text, 'Share', 550, 295);
}



/*** Search ***/
function searchText(text) {
  var search_url ='https://google.com/search?q=';
  popupwindow(search_url + encodeURIComponent(text), 'Search', 900, 540);
}

function translateText(doc, text) {
  var translate_url = 'https://translate.google.com/#auto/';
  var translate_to_language = $(doc).find("#options-translate-to select").find(":selected").val();
  popupwindow(translate_url + translate_to_language + '/' + text, 'Translate', 900, 540);
}

function popupwindow(url, title, w, h) {
  let left = screen.width / 2 - w / 2;
  let top = screen.height / 2 - h / 2;
  return window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  );
}

function saveSessionValue(key, val) {
  chrome.storage.session.get(key, function(result) {
      if (chrome.runtime.lastError) {
          console.error("Error retrieving key:", key, chrome.runtime.lastError);
          return;
      }

      const original = result[key]; // Retrieve the current value
      if (original !== val) { // Only update if the value is different

          chrome.storage.session.set({ [key]: val }, function() {
              if (chrome.runtime.lastError) {
                  console.error("Error saving value:", key, chrome.runtime.lastError);
              } else {
                  //console.log("Value saved successfully for", key, ":", val);

                  // Verify the saved value
                  chrome.storage.session.get(key, function(newResult) {
                      if (chrome.runtime.lastError) {
                          console.error("Error verifying saved value:", chrome.runtime.lastError);
                      } else {
                          //console.log("Saved value for",key,"verified:\noriginal:", original, "\nnew:", newResult[key]);
                      }
                  });
              }
          });
      } else {
          //console.log("No change detected. Value not updated for key:", key);
      }
  });
}

function saveStorageValue(key, val) {
  chrome.storage.sync.get(key, function(result) {
      if (chrome.runtime.lastError) {
          console.error("Error retrieving key:", key, chrome.runtime.lastError);
          return;
      }

      const original = result[key]; // Retrieve the current value
      if (original !== val) { // Only update if the value is different
          //console.log("About to save - ", original, " ==> ", val);

          chrome.storage.sync.set({ [key]: val }, function() {
              if (chrome.runtime.lastError) {
                  console.error("Error saving value:", key, chrome.runtime.lastError);
              } else {
                  //console.log("Value saved successfully for", key, ":", val);

                  // Verify the saved value
                  chrome.storage.sync.get(key, function(newResult) {
                      if (chrome.runtime.lastError) {
                          console.error("Error verifying saved value:", chrome.runtime.lastError);
                      } else {
                          //console.log("Saved value for",key,"verified:\noriginal:", original, "\nnew:", newResult[key]);
                      }
                  });
              }
          });
      } else {
          //console.log("No change detected. Value not updated for key:", key);
      }
  });
}


function setFontFamily(doc, val, save) {
  if(previousFontFamily == null){
    previousFontFamily = val;
    //console.log("Font family: No previous data! Setting to - ", previousFontFamily)
    showStyleSave(doc)
  }
  else if(previousFontFamily != val){
    font_family_changed = true;
    //console.log("Font family: Change detected! Marked as changed! Previous:",previousFontFamily," New:",status)
    showStyleSave(doc)
  }
  else if(previousFontFamily == val){
    font_family_changed = false;
    //console.log("Font family: No change detected! Marked as unchanged! Previous:",previousFontFamily," New:",status)
    showStyleSave(doc)
  }

    reader_ext_font_family = val;
    if(save){
    saveStorageValue('reader_ext_font_family', val);
    }
  $(doc).find('#reader-ext-content-container').css( "font-family", val );
  $(doc).find(`#options-font-family select option[value='${val}']`).prop('selected', true);
}
function setFontSize(doc, val, save) {
  
  if(previousFontSize == null){
    previousFontSize = val;
    //console.log("Font size: No previous data! Setting to - ", previousFontSize)
    showStyleSave(doc)
  }
  else if(previousFontSize != val){
    font_size_changed = true;
    //console.log("Font size: Change detected! Marked as changed! Previous:",previousFontSize," New:",status)
    showStyleSave(doc)
  }
  else if(previousFontSize == val){
    font_size_changed = false;
    //console.log("Font size: No change detected! Marked as unchanged! Previous:",previousFontSize," New:",status)
    showStyleSave(doc)
  }


    reader_ext_font_size = val;
    if(save){
    saveStorageValue('reader_ext_font_size', val);
    }
  $(doc).find("#reader-ext-content-container").css( "font-size", val );
  $(doc).find("#options-font-size input").val(  val );
  $(doc).find("#options-font-size .val").text(  val );
}
function setLineHeight(doc, val, save) {

  if(previousLineHeight == null){
    previousLineHeight = val;
    //console.log("Line height: No previous data! Setting to - ", previousLineHeight)
    showStyleSave(doc)
  }
  else if(previousLineHeight != val){
    line_height_changed = true;
    //console.log("Line height: Change detected! Marked as changed! Previous:",previousLineHeight," New:",status)
    showStyleSave(doc)
  }
  else if(previousLineHeight == val){
    line_height_changed = false;
    //console.log("Line height: No change detected! Marked as unchanged! Previous:",previousLineHeight," New:",status)
    showStyleSave(doc)
  }

    reader_ext_line_height = val;
    if(save){
    saveStorageValue('reader_ext_line_height', val);
    }
  $(doc).find("#reader-ext-content-container").css( "line-height", val );
  $(doc).find("#options-line-height input").val(  val );
  $(doc).find("#options-line-height .val").text(  val );
}
function setLetterSpace(doc, val, save) {

  if(previousLetterSpace == null){
    previousLetterSpace = val;
    //console.log("Letter space: No previous data! Setting to - ", previousLetterSpace)
    showStyleSave(doc)
  }
  else if(previousLetterSpace != val){
    letter_space_changed = true;
    //console.log("Letter space: Change detected! Marked as changed! Previous:",previousLetterSpace," New:",status)
    showStyleSave(doc)
  }
  else if(previousLetterSpace == val){
    letter_space_changed = false;
    //console.log("Letter space: No change detected! Marked as unchanged! Previous:",previousLetterSpace," New:",status)
    showStyleSave(doc)
  }

    reader_ext_letter_space = val;
    if(save){
    saveStorageValue('reader_ext_letter_space', val);
    }
  $(doc).find("#reader-ext-content-container").css( "letter-spacing", val );
  $(doc).find("#options-letter-space input").val(  val );
  $(doc).find("#options-letter-space .val").text(  val );
}
function setMaxWidth(doc, val, save) {
  
  if(previousMaxWidth == null){
    previousMaxWidth = val;
    //console.log("Max width: No previous data! Setting to - ", previousMaxWidth)
    showStyleSave(doc)
  }
  else if(previousMaxWidth != val){
    max_width_changed = true;
    //console.log("Max width: Change detected! Marked as changed! Previous:",previousMaxWidth," New:",status)
    showStyleSave(doc)
  }
  else if(previousMaxWidth == val){
    max_width_changed = false;
    //console.log("Max width: No change detected! Marked as unchanged! Previous:",previousMaxWidth," New:",status)
    showStyleSave(doc)
  }

    reader_ext_max_width = val;
    if(save){
    saveStorageValue('reader_ext_max_width', val);
    }

  reader_ext_max_width = val;
  $(doc).find("#reader-ext-container").css( "max-width", val );
  $(doc).find("#options-max-width .val").attr( "value", val );
  $(doc).find("#options-max-width .val").text(  val );
}

function setMargin(doc, val, save) {

  if(previousMargin == null){
    previousMargin = val;
    //console.log("Max width: No previous data! Setting to - ", previousMaxWidth)
    showStyleSave(doc)
  }
  else if(previousMargin != val){
    margin_changed = true;
    //console.log("Max width: Change detected! Marked as changed! Previous:",previousMaxWidth," New:",status)
    showStyleSave(doc)
  }
  else if(previousMargin == val){
    margin_changed = false;
    //console.log("Max width: No change detected! Marked as unchanged! Previous:",previousMaxWidth," New:",status)
    showStyleSave(doc)
  }

  // Apply the margin to the content container
  $(doc).find("#reader-foreground").css("padding-left", val + "px");
  $(doc).find("#reader-foreground").css("padding-right", val + "px");
  $(doc).find("#options-margin .val").attr( "value", val );
  $(doc).find("#options-margin .val").text(  val );

  reader_ext_margin = val;
  if (save) {
    saveStorageValue('reader_ext_margin', val);
  }
}

function setBackgroundColor(doc, val, theme, save) {
  
  

  if (theme == "light-theme") {
    reader_ext_background_color_light = default_background_color_light;

    //console.log("set background color to ", default_background_color_light)
    saveStorageValue('reader_ext_background_color_light', default_background_color_light);
    if(save){
      saveStorageValue('reader_ext_background_color_light', default_background_color_light);
    }
  } 
  else if (theme == "dark-theme"){
    reader_ext_background_color_dark = default_background_color_dark;
    //console.log("set background color to ", val)
 
    if(save){
      saveStorageValue('reader_ext_background_color_dark', default_background_color_dark);
    }
  } 
  else if (theme == "custom-theme"){
    reader_ext_background_color = val;

    if(previousBackgroundColor == null){
      previousBackgroundColor = val;
      //console.log("Background Color: No previous data! Setting to - ", previousBackgroundColor)
      showThemeSave(doc)
  
    }
    else if(previousBackgroundColor != val){
      background_color_changed = true;
      //console.log("Background Color: Change detected! Marked as changed! Previous:",previousBackgroundColor," New:",val)
      showThemeSave(doc)
    }
    else if(previousBackgroundColor == val){
      background_color_changed = false;
      //console.log("Background Color: No change detected! Marked as unchanged! Previous:",previousBackgroundColor," New:",val)
      showThemeSave(doc)
    }
 
    rateLimitLog("set background color to ", val)
    if(save){
    saveStorageValue('reader_ext_background_color', val);
    //console.log("stored custom color ", val)
    }
  } else {
  }

  $(doc).find("#reader-ext-body").css( "background-color", val );
 
  $(doc).find("#options-theme ul li a[data-theme='"+theme+"']").css("background-color", val);

  $(doc).find("#options-background-color input[name='background_color']").val( val );
  $(doc).find("#options-background-color input[type='color']").val(  val );
  $(doc).find("#options-background-color label.color").css('background-color', val);
}

function setForegroundColor(doc, val, theme, save) {
  
  if (theme == "light-theme") {
    reader_ext_foreground_color_light = default_foreground_color_light;

    //console.log("set foreground color to ", default_foreground_color_light)

    if(save){
      saveStorageValue('reader_ext_foreground_color_light', default_foreground_color_light);
    }
  } 
  else if (theme == "dark-theme"){
    reader_ext_foreground_color_dark = default_foreground_color_dark;
    //console.log("set foreground color to ", val)

    if(save){
      saveStorageValue('reader_ext_foreground_color_dark', default_foreground_color_dark);
    }
  } 
  else if (theme == "custom-theme"){
    reader_ext_foreground_color = val;
 
    if(previousForegroundColor == null){
      previousForegroundColor = val;
      //console.log("Foreground Color: No previous data! Setting to - ", previousForegroundColor)
      showThemeSave(doc)
    }
    else if(previousForegroundColor != val){
      foreground_color_changed = true;
      //console.log("Foreground Color: Change detected! Marked as changed! Previous:",previousForegroundColor," New:",val)
      showThemeSave(doc)
    }
    else if(previousForegroundColor == val){
      foreground_color_changed = false;
      //console.log("Foreground Color: No change detected! Marked as unchanged! Previous:",previousForegroundColor," New:",val)
      showThemeSave(doc)
    }

    rateLimitLog("set Foreground color to ", val)
    if(save){
    saveStorageValue('reader_ext_foreground_color', val);
    //console.log("stored custom foreground", val)
    }
  }

  $(doc).find("#reader-foreground").css( {
    "background-color": val, 
    "box-shadow": "0 8px 16px rgba(0, 0, 0, 0.1)",
});

  // if(getCheckboxStatus( $(doc).find("#options-display-foreground input") ) == "on"){
  //   $(doc).find("#reader-foreground").css( {
  //     "background-color": val, 
  //     "box-shadow": "0 8px 16px rgba(0, 0, 0, 0.1)",
  // });
  //   //console.log("foreground is on")
  // }
  // else{
  //   $(doc).find("#reader-foreground").css({
  //     "background-color":"transparent",
  //     "box-shadow": "0 0px 0px rgba(0, 0, 0, 0)"
  //   });
  //   //console.log("foreground is off")
  // }
  $(doc).find("#options-foreground-color input[name='foreground_color']").val( val );
  $(doc).find("#options-foreground-color input[type='color']").val(  val );
  $(doc).find("#options-foreground-color label.color").css('background-color', val);
}


function setTextColor(doc, val, theme, save) {
  
  if (theme == "light-theme") {
    reader_ext_text_color_light = val;

    if(save){
    saveStorageValue('reader_ext_text_color_light', val)
    }
  } else if (theme == "dark-theme"){
    reader_ext_text_color_dark = val;

    if(save){
    saveStorageValue('reader_ext_text_color_dark', val)
    }
  } else if (theme == "custom-theme"){

    if(previousTextColor == null){
      previousTextColor = val;
      //console.log("Text Color: No previous data! Setting to - ", previousTextColor)
      showThemeSave(doc)
  
    }
    else if(previousTextColor != val){
      text_color_changed = true;
      //console.log("Text Color: Change detected! Marked as changed! Previous:",previousTextColor," New:",val)
      showThemeSave(doc)
    }
    else if(previousTextColor == val){
      text_color_changed = false;
      //console.log("Text Color: No change detected! Marked as unchanged! Previous:",previousTextColor," New:",val)
      showThemeSave(doc)
    }

    reader_ext_text_color = val;
    if(save){
    saveStorageValue('reader_ext_text_color', val)
    }
  } else {
  }

  $(doc).find("#reader-ext-body").css("color", val);
  $(doc).find("#reader-ext-outline a").css("color", val);
  $(doc).find("#reader-ext-content table td").css("color", val);
  $(doc).find("#reader-ext-content table tr").css("color", val);
  $(doc).find("#reader-ext-content table th").css("color", val);
  $(doc).find("#reader-ext-content table").css("border-color", val);


  $(doc).find("#options-text-color input[name='text_color']").val(  val );
  $(doc).find("#options-text-color input[type='color']").val(  val );
  $(doc).find("#options-text-color label.color").css('background-color', val);
}



function setLinkColor(doc, val, theme, save) {
  
  if (theme == "light-theme") {
    reader_ext_link_color_light = val;

    if(save){
    saveStorageValue('reader_ext_link_color_light', val)
    }
  } else if (theme == "dark-theme"){
    reader_ext_link_color_dark = val;

    if(save){
    saveStorageValue('reader_ext_link_color_dark', val)
    }
  } else if (theme == "custom-theme"){

    reader_ext_link_color = val;

    if(previousLinkColor == null){
      previousLinkColor = val;
      //console.log("Link Color: No previous data! Setting to - ", previousLinkColor)
      showThemeSave(doc)
  
    }
    else if(previousLinkColor != val){
      link_color_changed = true;
      //console.log("Link Color: Change detected! Marked as changed! Previous:",previousLinkColor," New:",val)
      showThemeSave(doc)
    }
    else if(previousLinkColor == val){
      link_color_changed = false;
      //console.log("Link Color: No change detected! Marked as unchanged! Previous:",previousLinkColor," New:",val)
      showThemeSave(doc)
    }


    if(save){
    saveStorageValue('reader_ext_link_color', val)
    }
  } else {
  }
  $(doc).find("#reader-ext-body").find("a:not(#reader-ext-outline a)").css( "color", val );

  $(doc).find("#options-link-color input[name='link_color']").val(  val );
  $(doc).find("#options-link-color input[type='color']").val(  val );
  $(doc).find("#options-link-color label.color").css('background-color', val);
}


function setTheme(doc, val, save){
  //console.log('---setTheme called---')
  reader_ext_theme = val;
  //console.log("SET reader_ext_theme TO VALUE OF - ", reader_ext_theme)
  $(doc).find("#options-theme ul li a").each(function(){
    if ($(this).attr("data-theme") == val) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });
  $(doc).find("#reader-ext-body").attr("class", val);

  if (val == "light-theme") {
    showPalette(false, doc);
    setBackgroundColor(doc, reader_ext_background_color_light.toUpperCase(), "light-theme");
    setForegroundColor(doc, reader_ext_foreground_color_light.toUpperCase(), "light-theme");
    setTextColor(doc, reader_ext_text_color_light.toUpperCase(), "light-theme");
    setLinkColor(doc, reader_ext_link_color_light.toUpperCase(), "light-theme");
    //console.log("CHANGED TO LIGHT THEME")

    $(doc).find('::-webkit-scrollbar-track').css('background', reader_ext_background_color_light.toUpperCase());

  } else if (val == "dark-theme") {
    showPalette(false, doc);
    setBackgroundColor(doc, reader_ext_background_color_dark.toUpperCase(), "dark-theme");
    setForegroundColor(doc, reader_ext_foreground_color_dark.toUpperCase(), "dark-theme");
    setTextColor(doc, reader_ext_text_color_dark.toUpperCase(), "dark-theme");
    setLinkColor(doc, reader_ext_link_color_dark.toUpperCase(), "dark-theme");
    $(doc).find('::-webkit-scrollbar-track').css('background', reader_ext_background_color_dark.toUpperCase());
    //console.log("CHANGED TO DARK THEME")
  } else if (val == "custom-theme") {
    showPalette(true, doc);
    setBackgroundColor(doc, reader_ext_background_color.toUpperCase(), "custom-theme");
    setForegroundColor(doc, reader_ext_foreground_color.toUpperCase(), "custom-theme");
    setTextColor(doc, reader_ext_text_color.toUpperCase(), "custom-theme");
    setLinkColor(doc, reader_ext_link_color.toUpperCase(), "custom-theme");
    $(doc).find('::-webkit-scrollbar-track').css('background', reader_ext_background_color.toUpperCase());
    //console.log("CHANGED TO CUSTOM THEME")
  }``

  if(tempThemeSync=='off'){
    saveStorageValue('last_manual_theme', reader_ext_theme)
    //console.log("Manually changed, saving entry! - ",reader_ext_theme)
  }
  else{
    //console.log("theme sync is not off. Value is - ",tempThemeSync)
  }

  // chrome.storage.sync.get('reader_ext_theme_sync', function(result){
  //   if(result['reader_ext_theme_sync'] == 'off'){
  //     saveStorageValue('last_manual_theme', reader_ext_theme)
  //     //console.log("Manually changed, saving entry! - ",reader_ext_theme)
  //   }
  //   else{
  //     //console.log("theme sync is not off. Value is - ",result['reader_ext_theme_sync'])
  //   }
  // })

  //console.log("REQUESTING SAVE FOR reader_ext_theme - ", reader_ext_theme)
  saveStorageValue('reader_ext_theme', reader_ext_theme)
  //console.log("Saved new theme config")
}

function setDisplayOutline(doc, status, save) {
  if(previousOutline == null){
    previousOutline = status;
    //console.log("Display: No previous data! Setting to - ", previousOutline)
    showOptionsSave(doc, 0)

  }
  else if(previousOutline != status){
    outline_changed = true;
    //console.log("Display: Change detected! Marked as changed! Previous:",previousOutline," New:",status)
    showOptionsSave(doc, 0)
  }
  else if(previousOutline == status){
    outline_changed = false;
    //console.log("Display: No change detected! Marked as unchanged! Previous:",previousOutline," New:",status)
    showOptionsSave(doc, 0)
  }
  if (status == "on") {
    $(doc).find('#reader-ext-outline').show();
    $(doc).find('#options-display-outline input').prop("checked", true);
  } else {
    $(doc).find('#reader-ext-outline').hide();
    $(doc).find('#options-display-outline input').prop("checked", false);
  }
 
    reader_ext_display_outline = status;
    if(save){
    saveStorageValue('reader_ext_display_outline', status);
    previousOutline = status;
    }
  
}
function setDisplayImages(doc, status, save) {
  if(previousImages == null){
    previousImages = status;
    //console.log("Images: No previous data! Setting to - ", previousImages)
    showOptionsSave(doc, 0)

  }
  else if(previousImages != status){
    images_changed = true;
    //console.log("Images: Change detected! Marked as changed! Previous:",previousImages," New:",status)
    showOptionsSave(doc, 0)
  }
  else if(previousImages == status){
    images_changed = false;
    //console.log("Images: No change detected! Marked as unchanged! Previous:",previousImages," New:",status)
    showOptionsSave(doc, 0)
  }
  if (status == "on") {
    $(doc).find('#reader-ext-content-container img').show();
    $(doc).find('#options-display-images input').prop("checked", true);
  } else {
    $(doc).find('#reader-ext-content-container img').hide();
    $(doc).find('#options-display-images input').prop("checked", false);
  }
  if (save) {
    reader_ext_display_images = status;
    
    saveStorageValue('reader_ext_display_images', status);

    previousImages = status;
    
  }
}

function setDisplayMeta(doc, status, save) {
  if(previousMeta == null){
    previousMeta = status;
    //console.log("Meta: No previous data! Setting to - ", previousMeta)
    showOptionsSave(doc, 0)

  }
  else if(previousMeta != status){
    meta_changed = true;
    //console.log("Meta: Change detected! Marked as changed! Previous:",previousMeta," New:",status)
    showOptionsSave(doc, 0)
  }
  else if(previousMeta == status){
    meta_changed = false;
    //console.log("Meta: No change detected! Marked as unchanged! Previous:",previousMeta," New:",status)
    showOptionsSave(doc, 0)
  }
  if (status == "on") {
    $(doc).find('#reader-ext-container #reader-ext-meta').show();
    $(doc).find('#options-display-meta input').prop("checked", true);
    $(doc).find('#options-display-author').show();
    $(doc).find('#options-display-reading-time').show();
  } else {
    $(doc).find('#reader-ext-container #reader-ext-meta').hide();
    $(doc).find('#options-display-meta input').prop("checked", false);
    $(doc).find('#options-display-author').hide();
    $(doc).find('#options-display-reading-time').hide();
  }
  if (save) {
    reader_ext_display_meta = status;
    
    saveStorageValue('reader_ext_display_meta', status);

    previousMeta = status;
    
  }
}



function setDisplayAuthor(doc, status, save) {
  if(previousAuthor == null){
    previousAuthor = status;
    //console.log("Author: No previous data! Setting to - ", previousAuthor)
    showOptionsSave(doc, 0)

  }
  else if(previousAuthor != status){
    author_changed = true;
    //console.log("Author: Change detected! Marked as changed! Previous:",previousAuthor," New:",status)
    showOptionsSave(doc, 0)
  }
  else if(previousAuthor == status){
    author_changed = false;
    //console.log("Author: No change detected! Marked as unchanged! Previous:",previousAuthor," New:",status)
    showOptionsSave(doc, 0)
  }
  if (status == "on") {
    $(doc).find('#reader-ext-container #reader-ext-meta-author').show();
    $(doc).find('#options-display-author input').prop("checked", true);
  } else {
    $(doc).find('#reader-ext-container #reader-ext-meta-author').hide();
    $(doc).find('#options-display-author input').prop("checked", false);
  }
  if (save) {
    reader_ext_display_author = status;
    
    saveStorageValue('reader_ext_display_author', status);
    previousAuthor = status;
    
  }
}
function setDisplayReadingTime(doc, status, save) {
  if(previousReadTime == null){
    previousReadTime = status;
    //console.log("ReadTime: No previous data! Setting to - ", previousReadTime)
    showOptionsSave(doc, 0)

  }
  else if(previousReadTime != status){
    read_time_changed = true;
    //console.log("ReadTime: Change detected! Marked as changed! Previous:",previousReadTime," New:",status)
    showOptionsSave(doc, 0)
  }
  else if(previousReadTime == status){
    read_time_changed = false;
    //console.log("ReadTime: No change detected! Marked as unchanged! Previous:",previousReadTime," New:",status)
    showOptionsSave(doc, 0)
  }
  if (status == "on") {
    $(doc).find('#reader-ext-container #reader-ext-meta-reading-time').show();
    $(doc).find('#options-display-reading-time input').prop("checked", true);
  } else {
    $(doc).find('#reader-ext-container #reader-ext-meta-reading-time').hide();
    $(doc).find('#options-display-reading-time input').prop("checked", false);
  }

  if (save) {
    reader_ext_display_reading_time = status;
    
    saveStorageValue('reader_ext_display_reading_time', status);
    previousReadTime = status;
    
  }
}

function setDarkPanel(doc, status, save){
  tempDarkPanel = status
  if(previousDarkPanel == null){
    previousDarkPanel = status;
    //console.log("Dark Panel: No previous data! Setting to - ", previousDarkPanel)
    showOptionsSave(doc, 0)

  }
  else if(previousDarkPanel != status){
    dark_panel_changed = true;
    //console.log("Dark Panel: Change detected! Marked as changed! Previous:",previousDarkPanel," New:",status)
    showOptionsSave(doc, 0)
  }
  
  else if(previousDarkPanel == status){
    dark_panel_changed = false;
    //console.log("Dark Panel: No change detected! Marked as unchanged! Previous:",previousDarkPanel," New:",status)
    showOptionsSave(doc, 0)
  }

  if (status == "on") {
    $(doc).find("#reader-ext-container .options-panel").addClass("options-panel-dark");
    $(doc).find("#options-dark-panel input").prop("checked", true);
    reader_ext_dark_panel = status;

  } else {
    $(doc).find("#reader-ext-container .options-panel").attr("class", "options-panel");
    $(doc).find("#options-dark-panel input").prop("checked", false);
    reader_ext_dark_panel = status;
  }

  if (save) {

    saveStorageValue('reader_ext_dark_panel', status);

    previousDarkPanel = status;    
    
  }
}

function setThemeSync(doc, status, save){
  if(previousThemeSync==null){
    previousThemeSync = status;
    //console.log("Theme Sync: No previous data! Setting to - ", previousThemeSync)
    showThemeSave(doc, 0)
  }
  else if(previousThemeSync != status){
    theme_sync_changed = true;
    //console.log("Theme Sync: Change detected! Marked as changed! Previous:",previousThemeSync," New:",status)
    showOptionsSave(doc,0)
  }
  else if(previousThemeSync == status){
    theme_sync_changed = false;
    //console.log("Theme Sync: No change detected! Marked as unchanged! Previous:",previousThemeSync," New:",status)
    showOptionsSave(doc,0)
  }
  if (status == "on") {
    reader_ext_theme_sync = status;
    saveStorageValue('reader_ext_theme_sync',reader_ext_theme_sync)
    tempThemeSync = "on";
    chrome.storage.sync.get('last_manual_theme', function(result){
      //console.log("Uploading last manual theme: - ",result['last_manual_theme'])
      tempLastTheme = result['last_manual_theme']
    })
    if(window.matchMedia('(prefers-color-scheme: light)').matches){
      reader_ext_theme = "light-theme"
    }
    else{
      reader_ext_theme = "dark-theme"
    }

    $(doc).find('#options-theme').hide();
    $(doc).find('#options-theme-sync input').prop("checked", true);
    //console.log("Set to default device theme: light=",window.matchMedia('(prefers-color-scheme: light)').matches)
    //console.log("Turned on sync -",reader_ext_theme_sync)
  }
  else if(status=="off"){

    // chrome.storage.sync.get('reader_ext_theme_sync',function(result){
    //   //console.log("Current reader_ext_theme_sync - ",result['reader_ext_theme_sync'])
    //   if(result['reader_ext_theme_sync']=='on'){
    //     chrome.storage.sync.get('last_manual_theme', function(result){
    //       if(result['last_manual_theme']){
    //         reader_ext_theme = result['last_manual_theme']
    //         //console.log("Retrieved last manual theme! - ",reader_ext_theme)
    //       }
    //       else{
    //         //console.log("No previously recorded manual theme changes, setting to custom.")
    //         reader_ext_theme = 'custom-theme'
    //       }
    //       //console.log("Sync is off - restored last manual theme: - ",reader_ext_theme)
    //     })
    //   }
    // })
    //console.log("status switched to off")
    if(tempThemeSync=='on'){
      //console.log("Theme sync going from on to off. Change to last manual theme.")
      if(tempLastTheme){
        //console.log("Sync is going from on to off - restored last manual theme: - ",tempLastTheme)
        reader_ext_theme = tempLastTheme
        //console.log("Retrieved last manual theme! - ",reader_ext_theme)
      }
      else{
        //console.log("Not previously recorded manual theme changes, setting to custom.")
        reader_ext_theme = 'custom-theme'
      }
    }
    reader_ext_theme_sync = status;
    saveStorageValue('reader_ext_theme_sync',reader_ext_theme_sync)

    $(doc).find('#options-theme').show();
    $(doc).find('#options-theme-sync input').prop("checked", false);
    //console.log("Set to manual theme.")
  }
  tempThemeSync=status
  previousThemeSync = status;
  setTheme(doc,reader_ext_theme,true)

}

function setDisplayFooter(doc, status, save) {

  if(previousFooter == null){
    previousFooter = status;
    //console.log("Footer: No previous data! Setting to - ", previousFooter)
    showOptionsSave(doc, 0)
  }
  else if(previousFooter != status){
    footer_changed = true;
    //console.log("Footer: Change detected! Marked as changed! Previous:",previousFooter," New:",status)
    showOptionsSave(doc, 0)
  }
  else if(previousFooter == status){
    footer_changed = false;
    //console.log("Footer: No change detected! Marked as unchanged! Previous:",previousFooter," New:",status)
    showOptionsSave(doc, 0)
  }

  if (status == "on") {
    $(doc).find('#reader-ext-container #reader-ext-footer').show();
    $(doc).find('#options-display-footer input').prop("checked", true);
  } else {
    $(doc).find('#reader-ext-container #reader-ext-footer').hide();
    $(doc).find('#options-display-footer input').prop("checked", false);
  }
  if (save) {
    reader_ext_display_meta = status;
   
    saveStorageValue('reader_ext_display_meta', status);

    previousFooter = status;
    
  }
}

function setDefaultCss(doc, val, save){
  if (save) {
    reader_ext_default_css = val;
    saveStorageValue('reader_ext_default_css', val);
  }
  $(doc).find("#options-default-css textarea").html(val);
  if ($(doc).find("#reader_ext_default_css").length == false) {
    $("<style id='reader_ext_default_css'>").text(val).appendTo(doc.head);
  }
  $(doc).find("#reader_ext_default_css").html(val);
}




/*** Options Listeners & Save ***/
function optionsDefaultSettings(doc) {
  // Options Style
  chrome.storage.sync.get(['reader_ext_font_family'],function(result){setFontFamily(doc, (result.reader_ext_font_family) ? result.reader_ext_font_family : 'Arial', true) });
  chrome.storage.sync.get(['reader_ext_font_size'],function(result){setFontSize(doc, (result.reader_ext_font_size) ? result.reader_ext_font_size : 16, true) });
  chrome.storage.sync.get(['reader_ext_line_height'],function(result){setLineHeight(doc, (result.reader_ext_line_height) ? result.reader_ext_line_height : 1.84, true) });
  chrome.storage.sync.get(['reader_ext_letter_space'],function(result){setLetterSpace(doc, (result.reader_ext_letter_space) ? result.reader_ext_letter_space : 0, true) });
  chrome.storage.sync.get(['reader_ext_max_width'],function(result){setMaxWidth(doc, (result.reader_ext_max_width) ? result.reader_ext_max_width : 680, true) });
  chrome.storage.sync.get(['reader_ext_margin'], function(result) {setMargin(doc, (result.reader_ext_margin) ? result.reader_ext_margin : 40, true);});
  // Themes
  // Theme & DefaultCSS
  chrome.storage.sync.get(['reader_ext_default_css'], function(result) {
    if (result.reader_ext_default_css) {
      setDefaultCss(doc, result.reader_ext_default_css, true);
    } else {
      fetch(chrome.runtime.getURL('styles/default.css')).then(response => response.text()).then(data => {
        setDefaultCss(doc, data, true);
        reader_ext_default_css = data;
      });
    }
  });

  /////////////////////// NEVER USING GLOBAL VARIABLES CUZ WHY DID I SPEND 6 HOURS ON THIS STUPID THING THAT BROKE BECAUSE THE ORDER OF THE COMMANDS

  // Light Theme
  chrome.storage.sync.get(['reader_ext_background_color_light'],function(result){ setBackgroundColor(doc, (default_background_color_light), "light-theme", true) });
  chrome.storage.sync.get(['reader_ext_foreground_color_light'],function(result){ setForegroundColor(doc, (default_foreground_color_light), "light-theme", true) });
  chrome.storage.sync.get(['reader_ext_text_color_light'],function(result){ setTextColor(doc, (default_text_color_light), "light-theme", true) });
  chrome.storage.sync.get(['reader_ext_link_color_light'],function(result){ setLinkColor(doc, (default_link_color_light), "light-theme", true) });
   // Dark Theme
  chrome.storage.sync.get(['reader_ext_background_color_dark'],function(result){ setBackgroundColor(doc, (default_background_color_dark), "dark-theme", true) });
  chrome.storage.sync.get(['reader_ext_foreground_color_dark'],function(result){ setForegroundColor(doc, (default_foreground_color_dark), "dark-theme", true) });
  chrome.storage.sync.get(['reader_ext_text_color_dark'],function(result){ setTextColor(doc, (default_text_color_dark), "dark-theme", true) });
  chrome.storage.sync.get(['reader_ext_link_color_dark'],function(result){ setLinkColor(doc, (default_linkcolor_dark), "dark-theme", true) });
   // Custom Theme
  chrome.storage.sync.get(['reader_ext_background_color'],function(result){ setBackgroundColor(doc, (result.reader_ext_background_color ? result.reader_ext_background_color.toUpperCase() : "#F8F1E3"), "custom-theme", true) });
  chrome.storage.sync.get(['reader_ext_foreground_color'],function(result){ setForegroundColor(doc, (result.reader_ext_foreground_color ? result.reader_ext_foreground_color.toUpperCase() : "#FFFFFF"), "custom-theme", true) });
  chrome.storage.sync.get(['reader_ext_text_color'],function(result){ setTextColor(doc, (result.reader_ext_text_color ? result.reader_ext_text_color : "#333333"), "custom-theme", true) });
  chrome.storage.sync.get(['reader_ext_link_color'],function(result){ setLinkColor(doc, (result.reader_ext_link_color ? result.reader_ext_link_color : "#5F6368"), "custom-theme", true) });
  // Theme (need to be down here bcoz setTheme requires themes' values)
  //console.log("Getting theme...")
  chrome.storage.sync.get(['reader_ext_theme'],function(result){ setTheme(doc, (result.reader_ext_theme ? result.reader_ext_theme : "custom-theme"), false);})

  // Theme Sync
  chrome.storage.sync.get(['reader_ext_theme_sync'],function(result){ tempThemeSync=(result.reader_ext_theme_sync ? result.reader_ext_theme_sync : "on");setThemeSync(doc, (result.reader_ext_theme_sync) ? result.reader_ext_theme_sync : "on", true) });
  chrome.storage.sync.get(['last_manual_theme'],function(result){tempLastTheme=(result.last_manual_theme ? result.last_manual_theme : 'custom-theme')})
  

  

  // Reader Components
  chrome.storage.sync.get(['reader_ext_dark_panel'],function(result){setDarkPanel(doc, (result.reader_ext_dark_panel) ? result.reader_ext_dark_panel : "on", true) });
  chrome.storage.sync.get(['reader_ext_display_footer'],function(result){setDisplayFooter(doc, (result.reader_ext_display_footer) ? result.reader_ext_display_footer : "on", true) });
  chrome.storage.sync.get(['reader_ext_display_outline'],function(result){setDisplayOutline(doc, (result.reader_ext_display_outline) ? result.reader_ext_display_outline : "off", true) });
  chrome.storage.sync.get(['reader_ext_display_images'],function(result){setDisplayImages(doc, (result.reader_ext_display_images) ? result.reader_ext_display_images : "on", true) });
  chrome.storage.sync.get(['reader_ext_display_meta'],function(result){setDisplayMeta(doc, (result.reader_ext_display_meta) ? result.reader_ext_display_meta : "on", true) });
  chrome.storage.sync.get(['reader_ext_display_author'],function(result){setDisplayAuthor(doc, (result.reader_ext_display_author) ? result.reader_ext_display_author : "on", true) });
  chrome.storage.sync.get(['reader_ext_display_reading_time'],function(result){setDisplayReadingTime(doc, (result.reader_ext_display_reading_time) ? result.reader_ext_display_reading_time : "on", true) });
  
}
function optionsMenu(iframe) {
  var doc = iframe.contentWindow.document;

  // Handle Active Menu/Panel
  $(doc).find("#options-menu li a").click(function(){
    $(doc).find("#options-menu li a").attr("class","tooltip");

    this_menu = $(this);
    $(doc).find(".options-panel").each(function(index, panel){
      if ( $(this_menu).attr("data-panel") == $(panel).attr("id") ) {
        if ( $(panel).is(":visible") ) {
          $(panel).hide();
        } else {
          $(this_menu).addClass("active");
          $(panel).show();
        }
      } else {
        $(panel).hide();
      }
    });
  });

  // Delete Element
  $(doc).find("#options-delete-element").click(function(){
    $(this).hide();
    $(doc).find("#options-delete-element-stop").show();
    startDeleteElement(doc);
  });

  // Undo Delete Element
  $(doc).find("#options-delete-element-undo").click(function(){
    undoDeletedElement(doc);
  });

  // Fullscreen
  $(doc).find('#options-fullscreen').click(function () {
    fullscreen.toggle($('#container')[0]).then(function () {
      if (fullscreen.isFullscreen) {
        $(doc).find('#options-fullscreen i.bx-fullscreen').hide();
        $(doc).find('#options-fullscreen i.bx-exit-fullscreen').show();
      } else {
        $(doc).find('#options-fullscreen i.bx-fullscreen').show();
        $(doc).find('#options-fullscreen i.bx-exit-fullscreen').hide();
      }
    });
  });

  // Print
  $(doc).find("#options-print").click(function(){
    $(doc).find("#reader-foreground").css({"box-shadow":"0 0px 0px rgba(0, 0, 0, 0.1)"});
    iframe.contentWindow.print();
    $(doc).find("#reader-foreground").css({"box-shadow":"0 8px 16px rgba(0, 0, 0, 0.1)"});

  });

  // Save Page
  // $(doc).find("#options-save-page").click(function(){
  //   savePage(doc);
  // });
  $(doc).find("#options-saved-panel a.close").click(function(){
    $(doc).find("#options-menu li a").attr("class","tooltip");
    $(doc).find("#options-saved-panel").hide();
  });

  // Close
  $(doc).find("#options-close").click(function(){
    removeIframe();
  });
  

}

function optionsPanelCloseHandler(doc){
  $(doc).click(function(e){
    target = $(e.target);
    setTimeout(function(){
      $(doc).find(".options-panel").each(function(){
        id = "#"+$(this).attr('id');
        if ( $(doc).find(id).is(":visible") && (id != "#options-saved-panel") ) {
          if ( !target.parents( id ).length && !target.parents("#options-menu").length ) {
            $(doc).find( id ).hide();
            $(doc).find("#options-menu li a").removeClass("active");
          }
        }
      });
    }, 100);
  });
}



function optionsStyle(doc) {

  // Listeners
  $(doc).find("#options-font-family select").change(function() { setFontFamily(doc, $(this).val()); });
  $(doc).find("#options-font-size input").on("input change", function() { setFontSize(doc, $(this).val()); });
  $(doc).find("#options-line-height input").on("input change", function() { setLineHeight(doc, $(this).val()); });
  $(doc).find("#options-letter-space input").on("input change", function() { setLetterSpace(doc, $(this).val()); });
  $(doc).find("#options-max-width input").on("input change", function() { setMaxWidth(doc, $(this).val()); });
  $(doc).find("#options-margin input").on("input change", function() { setMargin(doc, $(this).val()); });

  // Save
  $(doc).find(".options-panel-content button[name='save-options-themes'], .options-panel-content button[name='save-options-style'], .options-panel-content button[name='save-options-reader-components']").click(function(e){
    
  }, showStyleSave(doc));
}

function getActiveTheme(doc){
  // Get active theme
  active = $(doc).find("#options-theme ul li a.active").attr("data-theme");
  //console.log("Active theme requested - ", active)
  return active;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var showSaveTimeout;
var saving = false;

var themeSaveTimeout;
var styleSaveTimeout;
var optionsSaveTimeout;

function showThemeSave(doc){
  
  
  if(font_family_changed || font_size_changed || line_height_changed || letter_space_changed || max_width_changed || margin_changed || dark_panel_changed || footer_changed || outline_changed || images_changed || meta_changed || author_changed || read_time_changed || background_color_changed || foreground_color_changed || link_color_changed || text_color_changed){
    updateSaveButtonTheme(doc)
    $(doc).find(".options-panel-content button[name='save-options-style']").show();
    $(doc).find(".options-panel-content button[name='save-options-themes']").show();
    $(doc).find(".options-panel-content button[name='save-options-reader-components']").show();
    removeSaveLabel(doc)
    //console.log("show theme save")
    saving = false;
    clearTimeout(themeSaveTimeout);
    clearTimeout(optionsSaveTimeout);
    clearTimeout(styleSaveTimeout);
  }else{
    if(saving){
      showSaveTimeout = 0;
    }
    else if(!saving){
      showSaveTimeout = 0;
    }
    themeSaveTimeout = setTimeout(()=>{
    $(doc).find(".options-panel-content button[name='save-options-style']").hide();
    $(doc).find(".options-panel-content button[name='save-options-themes']").hide();
    $(doc).find(".options-panel-content button[name='save-options-reader-components']").hide();
      ////console.log("hide theme save - Timeout set")
      saving = false;
    }, showSaveTimeout);
  }
}


function showStyleSave(doc){
  

  
  if(font_family_changed || font_size_changed || line_height_changed || letter_space_changed || max_width_changed || margin_changed || dark_panel_changed || footer_changed || outline_changed || images_changed || meta_changed || author_changed || read_time_changed || background_color_changed || foreground_color_changed || link_color_changed || text_color_changed){
    updateSaveButtonTheme(doc)
    $(doc).find(".options-panel-content button[name='save-options-style']").show();
    $(doc).find(".options-panel-content button[name='save-options-themes']").show();
    $(doc).find(".options-panel-content button[name='save-options-reader-components']").show();
    removeSaveLabel(doc)
      //console.log("show style save")
      saving = false;
      clearTimeout(themeSaveTimeout);
      clearTimeout(optionsSaveTimeout);
      clearTimeout(styleSaveTimeout);
  }else{
    if(saving){
      showSaveTimeout = 0;

    }
    else if(!saving){
      showSaveTimeout = 0;
    }
    styleSaveTimeout = setTimeout(()=>{
    $(doc).find(".options-panel-content button[name='save-options-style']").hide();
    $(doc).find(".options-panel-content button[name='save-options-themes']").hide();
    $(doc).find(".options-panel-content button[name='save-options-reader-components']").hide();
      ////console.log("hide style save - Timeout set")

      saving = false;
    }, showSaveTimeout);
  }

}

function showOptionsSave(doc){
  

  
    if(font_family_changed || font_size_changed || line_height_changed || letter_space_changed || max_width_changed || margin_changed || dark_panel_changed || footer_changed || outline_changed || images_changed || meta_changed || author_changed || read_time_changed || background_color_changed || foreground_color_changed || link_color_changed || text_color_changed){
      updateSaveButtonTheme(doc)
      $(doc).find(".options-panel-content button[name='save-options-style']").show();
      $(doc).find(".options-panel-content button[name='save-options-themes']").show();
      $(doc).find(".options-panel-content button[name='save-options-reader-components']").show();

      removeSaveLabel(doc);
        //console.log("show options save")
        saving = false;
        clearTimeout(themeSaveTimeout);
        clearTimeout(optionsSaveTimeout);
        clearTimeout(styleSaveTimeout);
    }else{
      if(saving){
        showSaveTimeout = 0;

      }
      else if(!saving){
        showSaveTimeout = 0;
      }
      optionsSaveTimeout = setTimeout(()=>{
      $(doc).find(".options-panel-content button[name='save-options-style']").hide();
      $(doc).find(".options-panel-content button[name='save-options-themes']").hide();
      $(doc).find(".options-panel-content button[name='save-options-reader-components']").hide();
        ////console.log("hide options save - Timeout set")
        saving = false;
      }, showSaveTimeout);
    }

}

function updateSaveButtonTheme(doc) {
  const saveButtons = $(doc).find(".options-panel-content button[name^='save-options']");
  //console.log('Configuring save buttons...')
  // Add new theme class based on reader_ext_theme
  if (tempDarkPanel=='on') {
    saveButtons.removeClass("save-button-light-theme");
    saveButtons.find('span').removeClass("save-span-light-theme")
    //console.log("Removed light theme from save button")
  }
  else if(tempDarkPanel=='off'){
    saveButtons.addClass("save-button-light-theme");
    saveButtons.find('span').addClass("save-span-light-theme")
    //console.log("Changed button to light theme")
  }
}



function optionsTheme(doc) {


  // Listeners
  $(doc).find("#options-theme ul li a").click(function() { reader_ext_theme = $(this).attr("data-theme"); setTheme(doc, reader_ext_theme,true);});
  $(doc).find("#options-theme-sync input").change(function(){ setThemeSync(doc, getCheckboxStatus($(this)));})
  $(doc).find("#options-background-color input").on("input change", function() { setBackgroundColor(doc, $(this).val().toUpperCase(), getActiveTheme(doc)) });
  $(doc).find("#options-foreground-color input").on("input change", function() { setForegroundColor(doc, $(this).val().toUpperCase(), getActiveTheme(doc)) });
  $(doc).find("#options-text-color input").on("input change", function() { setTextColor(doc, $(this).val(), getActiveTheme(doc)) });
  $(doc).find("#options-link-color input").on("input change", function() { setLinkColor(doc, $(this).val(), getActiveTheme(doc)) });
  

  // Save
  $(doc).find(".options-panel-content button[name='save-options-themes'], .options-panel-content button[name='save-options-style'], .options-panel-content button[name='save-options-reader-components']").click(function(e){
    
    
  }, showThemeSave(doc, false));
}

function optionsReaderComponents(doc) {
  // Listeners
  $(doc).find("#options-dark-panel input").change(function(){ setDarkPanel(doc, getCheckboxStatus($(this))); });
  $(doc).find("#options-display-footer input").change(function(){ setDisplayFooter(doc, getCheckboxStatus($(this))); });
  $(doc).find( "#options-display-outline input").change(function(){ setDisplayOutline(doc, getCheckboxStatus($(this))); });
  $(doc).find( "#options-display-images input").change(function(){ setDisplayImages(doc, getCheckboxStatus($(this))); });
  $(doc).find( "#options-display-meta input").change(function(){ setDisplayMeta(doc, getCheckboxStatus($(this))); });
  $(doc).find( "#options-display-author input").change(function(){ setDisplayAuthor(doc, getCheckboxStatus($(this))); });
  $(doc).find( "#options-display-reading-time input").change(function(){ setDisplayReadingTime(doc, getCheckboxStatus($(this)))});
  
  $(doc).find("#sitelinkcopy").click(function (event) {
    event.preventDefault();
    var linkElement = $(this);
    var hrefLink = linkElement.attr('href');
  
    if (hrefLink) {
      // Copy the link to the clipboard
      navigator.clipboard.writeText(hrefLink).then(() => {
        //console.log("Copied link - ", hrefLink);
  
        // Hide the original link
        linkElement.hide();
  
        // Create a new element for the message
        var messageElement = $('<span class="copy-message">Link copied!</span>');
  
        // Insert the message after the original link
        linkElement.after(messageElement);
  
        // After 1000 milliseconds (1 second), show the original link and remove the message
        setTimeout(function () {
          messageElement.remove();
          linkElement.show();
        }, 1000);
      });
    } else {
      //console.log("Href attribute not found.");
    }
  });
  
  

  // Save
  $(doc).find(".options-panel-content button[name='save-options-themes'], .options-panel-content button[name='save-options-style'], .options-panel-content button[name='save-options-reader-components']").click(function(e){
    
    reader_ext_font_family = $(doc).find("#options-font-family select").find(":selected").val();
    reader_ext_font_size = $(doc).find("#options-font-size input").val().trim();
    reader_ext_line_height = $(doc).find("#options-line-height input").val().trim();
    reader_ext_letter_space = $(doc).find("#options-letter-space input").val().trim();
    reader_ext_max_width = $(doc).find("#options-max-width input").val().trim();
    reader_ext_margin = $(doc).find("#options-margin input").val().trim();
    
    reader_ext_theme = getActiveTheme(doc);
    reader_ext_theme_sync = getCheckboxStatus($(doc).find("#options-theme-sync input"))
    reader_ext_background_color_active = $(doc).find("#options-background-color input[name='background_color']").val().trim().toUpperCase();
    reader_ext_foreground_color_active = $(doc).find("#options-foreground-color input[name='foreground_color']").val().trim().toUpperCase();
    reader_ext_text_color_active = $(doc).find("#options-text-color input[name='text_color']").val().trim().toUpperCase();
    reader_ext_link_color_active = $(doc).find("#options-link-color input[name='link_color']").val().trim().toUpperCase();
    
    reader_ext_auto_dark_panel = getCheckboxStatus( $(doc).find("#options-dark-panel input") );
    reader_ext_display_footer = getCheckboxStatus( $(doc).find("#options-display-footer input") );
    reader_ext_display_outline = getCheckboxStatus( $(doc).find("#options-display-outline input") );
    reader_ext_display_images = getCheckboxStatus( $(doc).find("#options-display-images input") );
    reader_ext_display_meta = getCheckboxStatus( $(doc).find("#options-display-meta input") );
    reader_ext_display_author = getCheckboxStatus( $(doc).find("#options-display-author input") );
    reader_ext_display_reading_time = getCheckboxStatus( $(doc).find("#options-display-reading-time input") );
    reader_ext_display_saved_info = getCheckboxStatus( $(doc).find("#options-display-saved-info input") );

    //////////////////////////////////////////


    if(font_family_changed){
      saveStorageValue("reader_ext_font_family", reader_ext_font_family);
      //console.log("font family saved - ", reader_ext_font_family);
      previousFontFamily = reader_ext_font_family;
      font_family_changed = false;
    }else{};

    if(font_size_changed){
      saveStorageValue("reader_ext_font_size", reader_ext_font_size);
      //console.log("font size sved - ", reader_ext_font_size);
      previousFontSize = reader_ext_font_size;
      font_size_changed = false;
    }else{};

    if(line_height_changed){
      saveStorageValue("reader_ext_line_height", reader_ext_line_height);
      //console.log("line height saved - ", reader_ext_line_height);
      previousLineHeight = reader_ext_line_height;
      font_size_changed = false;
    }else{};

    if(letter_space_changed){
      saveStorageValue("reader_ext_letter_space", reader_ext_letter_space);
      //console.log("letter space changed - ", reader_ext_letter_space);
      previousLetterSpace = reader_ext_letter_space;
      letter_space_changed = false;
    }

    if(max_width_changed){
      saveStorageValue("reader_ext_max_width", reader_ext_max_width);
      //console.log("max width saved - ", max_width_changed);
      previousMaxWidth = reader_ext_max_width;
      max_width_changed = false;
    }

    if(margin_changed){
      saveStorageValue("reader_ext_margin", reader_ext_margin);
      //console.log("max width saved - ", max_width_changed);
      previousMargin = reader_ext_margin;
      margin_changed = false;
    }

    saving = true;
    showStyleSave(doc);



    /////////////////////////////////////////////////


    if (reader_ext_theme == "light-theme") {
      reader_ext_background_color_light = reader_ext_background_color_active;
      reader_ext_foreground_color_light = reader_ext_foreground_color_active;
      reader_ext_text_color_light = reader_ext_text_color_active;
      reader_ext_link_color_light = reader_ext_link_color_active;
      
      saveStorageValue("reader_ext_background_color_light", reader_ext_background_color_active);
      saveStorageValue("reader_ext_foreground_color_light", reader_ext_foreground_color_active);
      saveStorageValue("reader_ext_text_color_light", reader_ext_text_color_active);
      saveStorageValue("reader_ext_link_color_light", reader_ext_link_color_active);
      
    } else if (reader_ext_theme == "dark-theme") {
      reader_ext_background_color_dark = reader_ext_background_color_active;
      reader_ext_foreground_color_dark = reader_ext_foreground_color_active;
      reader_ext_text_color_dark = reader_ext_text_color_active;
      reader_ext_link_color_dark = reader_ext_link_color_active;
      

      saveStorageValue("reader_ext_background_color_dark", reader_ext_background_color_active);
      saveStorageValue("reader_ext_foreground_color_dark", reader_ext_foreground_color_active);
      saveStorageValue("reader_ext_text_color_dark", reader_ext_text_color_active);
      saveStorageValue("reader_ext_link_color_dark", reader_ext_link_color_active);
     
    } else if (reader_ext_theme == "custom-theme") {
      //console.log("saving custom theme(1)")
      reader_ext_background_color_custom = reader_ext_background_color_active;
      reader_ext_foreground_color_custom = reader_ext_foreground_color_active;
      //console.log("saving: ", reader_ext_background_color_custom, " = ", reader_ext_background_color_active)
      //console.log("saving: ", reader_ext_foreground_color_custom, " = ", reader_ext_foreground_color_active)
      reader_ext_text_color_custom = reader_ext_text_color_active;
      reader_ext_link_color_custom = reader_ext_link_color_active;
      
      if(background_color_changed){
        saveStorageValue("reader_ext_background_color", reader_ext_background_color_active);
        //console.log("CUSTOM BACKGROUND SAVED - ", reader_ext_background_color_active);
        previousBackgroundColor = reader_ext_background_color_active;
        background_color_changed = false;
      }

      if(foreground_color_changed){
        saveStorageValue("reader_ext_foreground_color", reader_ext_foreground_color_active);
        //console.log("CUSTOM FOREGROUND SAVED - ", reader_ext_foreground_color_active);
        previousForegroundColor = reader_ext_foreground_color_active;
        foreground_color_changed = false;
      }

      if(text_color_changed){
        saveStorageValue("reader_ext_text_color", reader_ext_text_color_active);
        //console.log("CUSTOM TEXT SAVED - ", reader_ext_text_color_active);
        previousTextColor = reader_ext_text_color_active;
        text_color_changed = false;
      }

      if(link_color_changed){
        saveStorageValue("reader_ext_link_color", reader_ext_link_color_active);
        //console.log("CUSTOM LINK SAVED - ", reader_ext_link_color_active);
        previousLinkColor = reader_ext_link_color_active;
        link_color_changed = false;
      }
    
    }
    setTheme(doc, reader_ext_theme,true);
    saving = true;
    showThemeSave(doc)
    //console.log("saved theme")


    if(dark_panel_changed){
      saveStorageValue("reader_ext_dark_panel", reader_ext_auto_dark_panel);
      //console.log("Dark Panel changes saved - ", reader_ext_auto_dark_panel);
      previousDarkPanel = reader_ext_auto_dark_panel;
      dark_panel_changed = false;
    }else{
      //console.log("Dark Panel not saved(no changes recorded)");
    }

    if(footer_changed){
      saveStorageValue("reader_ext_display_footer", reader_ext_display_footer);
      //console.log("footer changes saved - ", reader_ext_display_footer);
      previousFooter = reader_ext_display_footer;
      footer_changed = false;
    }else{
      //console.log("Footer not saved(no changes recorded)");
    }

    if(outline_changed){
      saveStorageValue("reader_ext_display_outline", reader_ext_display_outline);
      //console.log("outline saved - ", reader_ext_display_outline);
      previousOutline = reader_ext_display_outline;
      outline_changed = false;
    }else{
      //console.log("Outline not saved(no changes recorded)");
    }

    if(images_changed){
      saveStorageValue("reader_ext_display_images", reader_ext_display_images);
      //console.log("images saved - ", reader_ext_display_images);
      previousImages = reader_ext_display_images;
      images_changed = false;
    }else{
      //console.log("images not saved(no changes recorded)");
    }

    if(meta_changed){
      saveStorageValue("reader_ext_display_meta", reader_ext_display_meta);
      //console.log("meta saved - ", reader_ext_display_meta);
      previousMeta = reader_ext_display_meta;
      meta_changed = false;
    }else{
      //console.log("meta not saved(no changes recorded)");
    }

    if(author_changed){
      saveStorageValue("reader_ext_display_author", reader_ext_display_author);
      previousAuthor = reader_ext_display_author;
      author_changed = false;
    }else{
      //console.log("author not saved(no changes recorded)");
    }

    if(read_time_changed){
      saveStorageValue("reader_ext_display_reading_time", reader_ext_display_reading_time);
      previousReadTime = reader_ext_display_reading_time;
      read_time_changed = false;
    }
    
    saving = true;
    showOptionsSave(doc);

    
    
    //showToast(doc, 'success', '<i class="fas fa-check-circle"></i></i> Successfully Saved!', e);
    //showSaveLabel(doc, e)

  },showOptionsSave(doc));

  

}

function showToast(doc, type, message, e){

  if(type = 'copylink'){
    let toast = doc.createElement('div');
    var toastTimeout;
    
    toast.classList.add("toast");
    toast.innerHTML = message;
    $(doc).find("#toastBox").append(toast);
    //$(doc).find(".toast").css({"background-color": '#464545'});
    $(doc).find(".toast").css({"text-color": 'black'});

    if(type == 'copylink'){
      toast.classList.add('copylink');
      toastTimeout = 2400;
    }

    $(doc).find(".toast").click(function(e){
      $(this).remove();
    })

    setTimeout(()=>{
      toast.remove();
    }, toastTimeout); // 1000ms = 1s
  }
}

function showSaveLabel(doc, e){
  //$("<span class='text-info' >Saved!</span>").insertAfter( $(e.target) ).fadeOut(1500, function() { $(this).remove() });

    // Create the text label element
    var textLabel = $("<span class='text-info save-label' id='ui-save-label'>Saved!</span>");
    var button = $($(e.target).closest('button')).attr('name'); // Find the closest button ancestor
    //console.log("target: ",$(e.target));

    // Get the font properties of the save button

    // Set the text label's height to match the save button's height

    if(button == 'save-options-reader-components'){
      var buttonHeight = $(e.target).closest('button').outerHeight() * 1.0; // Get the outer height of the save button
      var buttonPadding = 10;
    }
    else if(button == 'save-options-themes'){
      var buttonHeight = $(e.target).closest('button').outerHeight() * 1.0; // Get the outer height of the save button
      var buttonPadding = 20;
    }
    else if(button == 'save-options-style'){
      var buttonHeight = $(e.target).closest('button').outerHeight() * 1.0; // Get the outer height of the save button
      var buttonPadding = 30;
    }
    
    

    var buttonFont = {
      'font-family': $(e.target).closest('button').css('font-family'),
      'font-size': $(e.target).closest('button').css('font-size'),
      'font-weight': $(e.target).closest('button').css('font-weight'),
      'font-style': $(e.target).css('font-style'),
      'color': $(e.target).closest('button').css('color'),
      // Add more properties as needed
    };

    // Apply the font properties to the text label
    textLabel.css(buttonFont);
    textLabel.css('height', buttonHeight + 'px');
    textLabel.css('padding-top', buttonPadding + 'px');
    //console.log("e: ", $(e.target).closest('button').attr('name'), ', height: ', buttonHeight, ', padding: ', buttonPadding);

    // Insert the text label after the target element (save button)
    textLabel.insertAfter($(e.target).closest('button'));

    // Perform fadeOut and remove after a certain duration
    textLabel.fadeOut(1500, function() {
      $(this).remove();
    });
}

function removeSaveLabel(doc) {
  // Find the text label
  var textLabel = $(doc).find("#ui-save-label");
  
  
  if (textLabel.length > 0) {
    // Remove the text label
    textLabel.remove();
    //console.log("SAVE LABEL REMOVED");
  }
}


function markAsChanged(changedElement){
  switch (changedElement){
    case 0:
      font_family_changed = true;
    case 1:
      font_size_changed = true;
    case 2:
      line_height_changed = true;
    case 3:
      letter_space_changed = true;
    case 4:
      max_width_changed = true;
    case 5:
      background_color_changed = true;
    case 6:
      foreground_color_changed = true;
    case 7:
      text_color_changed = true;
    case 8:
      link_color_changed = true;
    case 9:
      dark_panel_changed = !dark_panel_changed;
    case 10:
      footer_changed = !footer_changed;
    case 11:
      outline_changed = !outline_changed;
    case 12:
      images_changed = !images_changed;
    case 13:
      meta_changed = !meta_changed;
    case 14:
      author_changed = !author_changed;
    case 15:
      read_time_changed = !read_time_changed;
    default:
      //console.log("Error, changed value not found!");
  }
  //console.log("changed value #", changedElement);
}


function init(){
  // Initialize iframe & doc
  var iframe = document.getElementById('reader-ext-iframe');
  var doc = iframe.contentWindow.document;

  // Get parsed article
  var article = getParsedArticle();
  title=article.title;
  excerpt = article.excerpt;
  content = article.content;

  article_url = window.location.href;
  if ( (article.byline == "") || (article.byline == "About 0 Minutes") ) {
    var author = "Unknown author";
  } else {
    var author = article.byline;
  }
  reading_time = readingTime(title+" "+content) + " min read";

  // Remove Media Playback from content
  content = content.replace("Media playback is unsupported on your device", "");

  // Fetch template for reader
  fetch(chrome.runtime.getURL('/content.html'))
  .then(response => response.text())
  .then(data => {

    // Add template to doc. Prevent injected links from refresh the iframe to original content
    doc.open();
    doc.write(data);
    doc.close();

    // Add preloader the second time after template was fetched
    startPreloader(doc);

    // Set article data based on current view
    // Set content outline
    setOutline(doc, article);
    // Set default main content
    $(doc).find("#reader-ext-title").html(title);
    $(doc).find("#reader-ext-content").html(content);
    setHeadingsForOutline(doc);
    $(doc).find("#reader-ext-content a").attr("target", "_blank");
    // Add meta, title, and reading-time
    if (article_url) {
      $(doc).find("#reader-ext-meta").append("<li id='reader-ext-meta-url'><i class='bx bx-link' ></i><span class='truncated'><a id='sitelinkcopy' href='"+article_url+"'  target='_blank' >"+article_url+"</a></span><li>");
    }
    if (author) {
      $(doc).find("#reader-ext-meta").append("<li id='reader-ext-meta-author'><i class='bx bxs-user' ></i><span class='reader-ext-author truncated'>"+author+"</span><li>");
    }
    if (reading_time) {
      $(doc).find("#reader-ext-meta").append("<li id='reader-ext-meta-reading-time'><i class='bx bx-time-five' ></i><span>"+reading_time+"</span><li>");
    }

    // Trim content
    trimContent(doc);

    // Add style tag
    addStyleTags(doc);

    // Toggle display sidebar
    //outlineDisplayToggle(doc);

    // Toolbar
    toolbarDisplayToggle(doc);
    toolbarNoteFormToggle(doc);
    toolbarActionsHandler(doc);

    // Options
    optionsDefaultSettings(doc);
    optionsMenu(iframe);
    optionsPanelCloseHandler(doc);
    optionsManualScroll(doc);
    optionsAccordian(doc);
    optionsColorPicker(doc);

    // Main Options Panel;
    optionsStyle(doc);
    optionsTheme(doc);
    optionsReaderComponents(doc);

    // Make sure no injected margin around the body
    $(doc).find("body").css("margin", 0);

    // Display iframe
    $(iframe).show();
    setTimeout(function(){
      $(doc).find("#reader-ext-pre-loader").fadeOut();
      $(doc).find("#reader-ext-body").show();

    }, 500);
  }).catch(err => {
    alert("Something went wrong... " + err)
  });
}
var latest_url;
// var readerActive
function launch() {
  var existing = document.querySelector('#reader-ext-iframe');
  console.log('existing iframe:', existing);

  // Detect past iframe - don't show another
  if (existing == null) {
    console.log('No iframe found');
    // Create iframe and append to body
    iframe = createIframe();
    document.body.appendChild(iframe);
    latest_url = window.location.href;
    init();
    console.log('created iframe')
    // readerActive = true
  } else {
    removeIframe()
    // If iframe is already present, remove it
    // console.log('Existing iframe found');
    // var iframe = existing;
    // if ($(iframe).is(':visible')) {
    //   $(iframe).fadeOut();
    // } else {
    //   // Only parse the article if the URL was changed
    //   if (latest_url == window.location.href) {
    //     $(iframe).fadeIn();
    //   } else {
    //     latest_url = window.location.href;
    //     init();
    //   }
    // }
    // console.log("Toggled iframe visibility:", iframe);
    // readerActive = false;
  }
}

// function launch() {

//   // Detect past iframe - don't create another
//   if(document.getElementById("reader-ext-iframe") == null || window == window.top) {
//     $("#reader-ext-iframe").remove()
//     //console.log('found and remove existing iframe')
//     // Create iframe and append to body
//     var iframe = createIframe();
//     document.body.appendChild(iframe);

//     latest_url = window.location.href;
//     init();
//   } else {
//     //console.log('no existing iframe found')
//     iframe = document.getElementById("reader-ext-iframe");
//     if($(iframe).is(':visible')){
//       $(iframe).fadeOut();
//     } else {
//       // Only parse the article if the url was changed
//       if (latest_url == window.location) {
//         $(iframe).fadeIn();
//       } else {
//         latest_url = window.location.href;
//         init();
//       }
//     }
//   }

// }

// Create iframe
function createIframe(){

  // Hide main document scrollbar
  document.body.style.overflow = 'hidden';

  var iframe = document.createElement('iframe');
  iframe.id = "reader-ext-iframe";
  iframe.style.height = "100%";
  iframe.style.width="100%";
  iframe.style.position = "fixed";
  iframe.style.top = '0';
  iframe.style.right = '0';
  iframe.style.left = '0'
  iframe.style.bottom = '0'
  iframe.style.zIndex = "9000000000000000000";
  iframe.style.backgroundColor = "#fff";
  iframe.sandbox = "allow-scripts allow-same-origin";

  preloader = getPreloader();
  $(iframe).contents().find('body').html(preloader);
  ////console.log(iframe)
  return iframe;
}

function removeIframe() {
    //console.log("removing iframe - ");
    $("#reader-ext-iframe").remove();
    iframe = null;
    //console.log("removed iframe - ");
    document.body.style.overflow = 'auto';
}


launch();

