/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/* global k, tiem, _ */
/*jshint indent:3, curly:false, laxbreak:true */

// var createTemplates = zipObjectT(_.first, _.compose(_.template, _.last))

var header = _.template(
         '<h1 class="title pure-u-1-2"><div id="tiem-ti">Ti</div><div id="tiem-m">m</div><div id="tiem-e">e</div><div id="card">card</div></h1>' +
         '<div class="stamp date pure-u-1-2">' +
         '  <button class="pure-button options">' +
         '    <i class="fa fa-gear"></i>' +
         '  </button>' +
         '  <button class="pure-button"><%= ' + k.day() + '.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric" })%></button>' +
         '</div>'
      )

var stamp = _.template(
         '<div class="stamp pure-g" id="<%= ' + k.jobId() + ' %>" style="display: none;" >' +
         '  <button class="pure-button pure-u-14-24 jobButton" title="<%-' + k.jobName() + '%>"> <%- ' + k.jobName() + ' %> </button>' +
         '  <button class="pure-button time pure-u-5-24" title="<%-' + k.state() + '.' + k['in']() + '%>"> <%= ' + k.state() + '.' + k['in']() + '.toLocaleTimeString() %></button>' +
         '  <button class="pure-button hours pure-u-3-24"> <%= Number(' + k.total() + ').toFixed(2) %> </button>' +
         '  <button class="pure-button notes pure-u-2-24" title="<%- ' + k.comment() + ' %>"> <i class="fa fa-pencil"></i> </button>' +
         '  <p class="pure-button comment pure-u-1-1 text-left wrap-word hidden"> <%- ' + k.comment() + ' %> </p> ' +
         '</div>'
      )

tiem = tiem
   .method(
      'stamp',
      tiem.hasAll([k.jobId(), k.jobName(), k.state(), k.total(), k.comment()]),
      stamp
   )
   .method(
      'header',
      _.partialRight(_.has, k.day()),
      header
   )
