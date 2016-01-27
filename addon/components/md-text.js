import Ember from 'ember';
import Remarkable from 'remarkable';
import hljs from 'hljs';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: '',

  text: '',
  typographer: false,
  linkify: false,
  html: false,
  extensions: true,

  parsedMarkdown: computed('text', 'html', 'typographer', 'linkify', function() {
    var md = new Remarkable({
      typographer: this.get('typographer'),
      linkify: this.get('linkify'),
      html: this.get('html'),

      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }

        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}

        return '';
      }
    });

    if (this.get('extensions')) {
      md.core.ruler.enable([
        'abbr'
      ]);
      md.block.ruler.enable([
        'footnote',
        'deflist'
      ]);
      md.inline.ruler.enable([
        'footnote_inline',
        'ins',
        'mark',
        'sub',
        'sup'
      ]);
    }

    var html = md.render(this.get('text'));
    // HACK: Add hljs class for compatibility with latest highlight.js CSS
    //       This should really be done with a `custom_fence` rule as
    //       described here:
    //       https://github.com/jonschlinkert/remarkable/issues/131
    html = html.replace(/<pre>/g, '<pre class="hljs">');
    return new Ember.Handlebars.SafeString(html);
  })
});
