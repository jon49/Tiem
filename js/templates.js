/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/* global Tiem, _ */

Tiem.Templates = function () {

    var templates = Tiem.zipObjectT(_.first, _.compose(_.template, _.last))

    return templates([
        ['stamp',
         '<div class="stamp pure-g" id="<%= ' + Tiem.k.jobId() + ' %>" style="display: none;" >' +
         '  <button class="pure-button pure-u-14-24 jobButton" title="<%-' + Tiem.k.jobName() + '%>"> <%- ' + Tiem.k.jobName() + ' %> </button>' +
         '  <button class="pure-button time pure-u-5-24" title="<%-' + Tiem.k.state() + '.' + Tiem.k['in']() + '%>"> <%= ' + Tiem.k.state() + '.' + Tiem.k['in']() + '.toLocaleTimeString() %></button>' +
         '  <button class="pure-button hours pure-u-3-24"> <%= Number(' + Tiem.k.total() + ').toFixed(2) %> </button>' +
         '  <button class="pure-button notes pure-u-2-24" title="<%- ' + Tiem.k.comment() + ' %>"> <i class="fa fa-pencil"></i> </button>' +
         '  <p class="pure-button comment pure-u-1-1 text-left wrap-word hidden"> <%- ' + Tiem.k.comment() + ' %> </p> ' +
         '</div>'],
        ['header',
         '<h1 class="title pure-u-1-2"><div id="tiem-ti">Ti</div><div id="tiem-m">m</div><div id="tiem-e">e</div><div id="card">card</div></h1>' +
         '<div class="stamp date pure-u-1-2">' +
         '  <button class="pure-button options">' +
         '    <i class="fa fa-gear"></i>' +
         '  </button>' +
         '  <button class="pure-button"><%= ' + Tiem.k.day() + '.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric" })%></button>' +
         '</div>'
        ]

    ])
}()