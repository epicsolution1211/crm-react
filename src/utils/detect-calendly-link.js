export function detectCalendlyLink(message) {
  const linkRegex = /(\b(https?|ftp|file):\/\/(?:[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|calendly\.com))/ig;
  const links = message.match(linkRegex);



  if (links) {
    const formattedString = message.replace(linkRegex, function(url) {
      return `
        <a onClick="openCalendlyWidget($(this))" data-link="${url}" href="javascript:;">${url}</a>
        <div style="display: none" class="calendly-inline-widget" data-url="${url}" style="position: relative;min-width:320px;height:100vh;" data-processed="true">
          <div class="calendly-spinner">
            <div class="calendly-bounce1"></div>
            <div class="calendly-bounce2"></div>
            <div class="calendly-bounce3"></div>
          </div>
          <a href="javascript:;" onClick="$(this).parent().slideToggle('fast');">Close calendly</a>
          <iframe src="${url}?embed_type=Inline" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      `
    });
    return formattedString;
  } else {
    return null;
  }
}
