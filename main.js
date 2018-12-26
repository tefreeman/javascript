var Arrive=function(a,b,c){'use strict';function d(r,s,t){h.addMethod(s,t,r.unbindEvent),h.addMethod(s,t,r.unbindEventWithSelectorOrCallback),h.addMethod(s,t,r.unbindEventWithSelectorAndCallback)}function f(r){r.arrive=o.bindEvent,d(o,r,'unbindArrive'),r.leave=p.bindEvent,d(p,r,'unbindLeave')}if(a.MutationObserver&&'undefined'!=typeof HTMLElement){var g=0,h=function(){var r=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(s,t){return s instanceof HTMLElement&&r.call(s,t)},addMethod:function(s,t,u){var v=s[t];s[t]=function(){return u.length==arguments.length?u.apply(this,arguments):'function'==typeof v?v.apply(this,arguments):void 0}},callCallbacks:function(s,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(s=[s[0]]);for(var v,u=0;v=s[u];u++)v&&v.callback&&v.callback.call(v.elem,v.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(s,t,u,v){for(var x,w=0;x=s[w];w++)u(x,t,v)&&v.push({callback:t.callback,elem:x}),0<x.childNodes.length&&h.checkChildNodesRecursively(x.childNodes,t,u,v)},mergeArrays:function(s,t){var v,u={};for(v in s)s.hasOwnProperty(v)&&(u[v]=s[v]);for(v in t)t.hasOwnProperty(v)&&(u[v]=t[v]);return u},toElementsArray:function(s){return'undefined'!=typeof s&&('number'!=typeof s.length||s===a)&&(s=[s]),s}}}(),k=function(){var r=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return r.prototype.addEvent=function(s,t,u,v){var w={target:s,selector:t,options:u,callback:v,firedElems:[]};return this._beforeAdding&&this._beforeAdding(w),this._eventsBucket.push(w),w},r.prototype.removeEvent=function(s){for(var u,t=this._eventsBucket.length-1;u=this._eventsBucket[t];t--)if(s(u)){this._beforeRemoving&&this._beforeRemoving(u);var v=this._eventsBucket.splice(t,1);v&&v.length&&(v[0].callback=null)}},r.prototype.beforeAdding=function(s){this._beforeAdding=s},r.prototype.beforeRemoving=function(s){this._beforeRemoving=s},r}(),l=function(r,s){var t=new k,u=this,v={fireOnAttributesModification:!1};return t.beforeAdding(function(w){var y,x=w.target;(x===a.document||x===a)&&(x=document.getElementsByTagName('html')[0]),y=new MutationObserver(function(A){s.call(this,A,w)});var z=r(w.options);y.observe(x,z),w.observer=y,w.me=u}),t.beforeRemoving(function(w){w.observer.disconnect()}),this.bindEvent=function(w,x,y){x=h.mergeArrays(v,x);for(var z=h.toElementsArray(this),A=0;A<z.length;A++)t.addEvent(z[A],w,x,y)},this.unbindEvent=function(){var w=h.toElementsArray(this);t.removeEvent(function(x){for(var y=0;y<w.length;y++)if(this===c||x.target===w[y])return!0;return!1})},this.unbindEventWithSelectorOrCallback=function(w){var z,x=h.toElementsArray(this);z='function'==typeof w?function(A){for(var B=0;B<x.length;B++)if((this===c||A.target===x[B])&&A.callback===w)return!0;return!1}:function(A){for(var B=0;B<x.length;B++)if((this===c||A.target===x[B])&&A.selector===w)return!0;return!1},t.removeEvent(z)},this.unbindEventWithSelectorAndCallback=function(w,x){var y=h.toElementsArray(this);t.removeEvent(function(z){for(var A=0;A<y.length;A++)if((this===c||z.target===y[A])&&z.selector===w&&z.callback===x)return!0;return!1})},this},m=function(){function t(w,x){return h.matchesSelector(w,x.selector)&&(w._id===c&&(w._id=g++),-1==x.firedElems.indexOf(w._id))&&(x.firedElems.push(w._id),!0)}var u={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};o=new l(function(w){var x={attributes:!1,childList:!0,subtree:!0};return w.fireOnAttributesModification&&(x.attributes=!0),x},function(w,x){w.forEach(function(y){var z=y.addedNodes,A=y.target,B=[];null!==z&&0<z.length?h.checkChildNodesRecursively(z,x,t,B):'attributes'===y.type&&t(A,x,B)&&B.push({callback:x.callback,elem:A}),h.callCallbacks(B,x)})});var v=o.bindEvent;return o.bindEvent=function(w,x,y){'undefined'==typeof y?(y=x,x=u):x=h.mergeArrays(u,x);var z=h.toElementsArray(this);if(x.existing){for(var C,A=[],B=0;B<z.length;B++){C=z[B].querySelectorAll(w);for(var D=0;D<C.length;D++)A.push({callback:y,elem:C[D]})}if(x.onceOnly&&A.length)return y.call(A[0].elem,A[0].elem);setTimeout(h.callCallbacks,1,A)}v.call(this,w,x,y)},o},n=function(){function t(w,x){return h.matchesSelector(w,x.selector)}var u={};p=new l(function(){return{childList:!0,subtree:!0}},function(w,x){w.forEach(function(y){var z=y.removedNodes,A=[];null!==z&&0<z.length&&h.checkChildNodesRecursively(z,x,t,A),h.callCallbacks(A,x)})});var v=p.bindEvent;return p.bindEvent=function(w,x,y){'undefined'==typeof y?(y=x,x=u):x=h.mergeArrays(u,x),v.call(this,w,x,y)},p},o=new m,p=new n;b&&f(b.fn),f(HTMLElement.prototype),f(NodeList.prototype),f(HTMLCollection.prototype),f(HTMLDocument.prototype),f(Window.prototype);var q={};return d(o,q,'unbindAllArrive'),d(p,q,'unbindAllLeave'),q}}(window,'undefined'==typeof jQuery?null:jQuery,void 0),fall2018Total=`<tbody><tr>
      <td colspan="2" class="dddead">&nbsp;</td>
      <th class="ddheader" scope="col">Attempted</th>
      <th class="ddheader" scope="col">Earned</th>
      <th class="ddheader" scope="col"><acronym title="Grade Point Average">GPA</acronym> Hours</th>
      <th class="ddheader" scope="col">Quality Points</th>
      <th class="ddheader" scope="col"><acronym title="Grade Point Average">GPA</acronym></th>
      </tr>
      <tr>
      <th colspan="2" class="ddlabel" scope="row">Current term: </th>
      <td class="dddefault"><p class="rightaligntext">       16.000</p></td>
      <td clas="dddefault"><p class="rightaligntext">       16.000</p></td>
      <td class="dddefault"><p class="rightaligntext">       16.000</p></td>
      <td class="dddefault"><p class="rightaligntext">             49.000</p></td>
      <td class="dddefault"><p class="rightaligntext">                     3.062</p></td>
      </tr>
      <tr>
      <th colspan="2" class="ddlabel" scope="row">Cumulative: </th>
      <td class="dddefault"><p class="rightaligntext">       57.000</p></td>
      <td class="dddefault"><p class="rightaligntext">       53.000</p></td>
      <td class="dddefault"><p class="rightaligntext">       54.000</p></td>
      <td class="dddefault"><p class="rightaligntext">            182.271</p></td>
      <td class="dddefault"><p class="rightaligntext">                     3.484</p></td>
      </tr>
      <tr>
      <th colspan="2" class="ddlabel" scope="row">Transfer: </th>
      <td class="dddefault"><p class="rightaligntext">       32.000</p></td>
      <td class="dddefault"><p class="rightaligntext">       32.000</p></td>
      <td class="dddefault"><p class="rightaligntext">       31.000</p></td>
      <td class="dddefault"><p class="rightaligntext">             97.000</p></td>
      <td class="dddefault"><p class="rightaligntext">                     3.129</p></td>
      </tr>
      <tr>
      <th colspan="2" class="ddlabel" scope="row">Overall: </th>
      <td class="dddefault"><p class="rightaligntext">       89.000</p></td>
      <td class="dddefault"><p class="rightaligntext">       78.000</p></td>
      <td class="dddefault"><p class="rightaligntext">       81.000</p></td>
      <td class="dddefault"><p class="rightaligntext">            245.320</p></td>
      <td class="dddefault"><p class="rightaligntext">                     3.247</p></td>
      </tr>
      </tbody>`,fall2018=`<tbody><tr>
      <th class="ddheader" scope="col"><acronym title="Course Reference Number">CRN</acronym></th>
      <th class="ddheader" scope="col">Subject</th>
      <th class="ddheader" scope="col">Course</th>
      <th class="ddheader" scope="col">Section</th>
      <th class="ddheader" scope="col">Course Title</th>
      <th class="ddheader" scope="col">Campus</th>
      <th class="ddheader" scope="col">Final Grade</th>
      <th class="ddheader" scope="col">Comment</th>
      <th class="ddheader" scope="col">Attempted</th>
      <th class="ddheader" scope="col">Earned</th>
      <th class="ddheader" scope="col"><p class="rightaligntext"><acronym title="Grade Point Average">GPA</acronym> Hours</p></th>
      <th class="ddheader" scope="col"><p class="rightaligntext">Quality Points</p></th>
      <td class="dddead">&nbsp;</td>
      </tr>
      <tr>
      <td class="dddefault">45256</td>
      <td class="dddefault">CS</td>
      <td class="dddefault">200</td>
      <td class="dddefault">001</td>
      <td class="dddefault">Software Design and Engineering</td>
      <td class="dddefault">Main Campus (Tuscaloosa)</td>
      <td class="dddefault">A-</td>
      <td class="dddead">&nbsp;</td>
      <td class="dddefault"><p class="rightaligntext">    4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">             14.680</p></td>
      <td class="dddead">&nbsp;</td>
      </tr>
      <tr>
      <td class="dddefault">45258</td>
      <td class="dddefault">CS</td>
      <td class="dddefault">201</td>
      <td class="dddefault">001</td>
      <td class="dddefault"> Data Structures and Algorithms</td>
      <td class="dddefault">Main Campus (Tuscaloosa)</td>
      <td class="dddefault">C</td>
      <td class="dddead">&nbsp;</td>
      <td class="dddefault"><p class="rightaligntext">    4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">              8.000</p></td>
      <td class="dddead">&nbsp;</td>
      </tr>
      <tr>
      <td class="dddefault">44139</td>
      <td class="dddefault">ECE</td>
      <td class="dddefault">380</td>
      <td class="dddefault">002</td>
      <td class="dddefault">Digital Logic</td>
      <td class="dddefault">Main Campus (Tuscaloosa)</td>
      <td class="dddefault">B+</td>
      <td class="dddead">&nbsp;</td>
      <td class="dddefault"><p class="rightaligntext">    4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        4.000</p></td>
      <td class="dddefault"><p class="rightaligntext">             13.320</p></td>
      <td class="dddead">&nbsp;</td>
      </tr>
      <tr>
      <td class="dddefault">44430</td>
      <td class="dddefault">ECE</td>
      <td class="dddefault">380</td>
      <td class="dddefault">323</td>
      <td class="dddefault">Digital Logic</td>
      <td class="dddefault">Main Campus (Tuscaloosa)</td>
      <td class="dddefault">NG</td>
      <td class="dddead">&nbsp;</td>
      <td class="dddefault"><p class="rightaligntext">    0.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        0.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        0.000</p></td>
      <td class="dddefault"><p class="rightaligntext">              0.000</p></td>
      <td class="dddead">&nbsp;</td>
      </tr>
      <tr>
      <td class="dddefault">43386</td>
      <td class="dddefault">MATH</td>
      <td class="dddefault">302</td>
      <td class="dddefault">001</td>
      <td class="dddefault">Topics in Discrete Mathematics</td>
      <td class="dddefault">Main Campus (Tuscaloosa)</td>
      <td class="dddefault">A</td>
      <td class="dddead">&nbsp;</td>
      <td class="dddefault"><p class="rightaligntext">    1.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        1.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        1.000</p></td>
      <td class="dddefault"><p class="rightaligntext">              4.000</p></td>
      <td class="dddead">&nbsp;</td>
      </tr>
      <tr>
      <td class="dddefault">45896</td>
      <td class="dddefault">MATH</td>
      <td class="dddefault">355</td>
      <td class="dddefault">005</td>
      <td class="dddefault">Theory Of Probability</td>
      <td class="dddefault">Main Campus (Tuscaloosa)</td>
      <td class="dddefault">B</td>
      <td class="dddead">&nbsp;</td>
      <td class="dddefault"><p class="rightaligntext">    3.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        3.000</p></td>
      <td class="dddefault"><p class="rightaligntext">        3.000</p></td>
      <td class="dddefault"><p class="rightaligntext">              9.000</p></td>
      <td class="dddead">&nbsp;</td>
      </tr>
      </tbody>`,spoofmaint=`<div id="plannedMaintenanceTable_wrappers" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-6"></div><div class="col-sm-6"></div></div><div class="row"><div class="col-sm-12"><div class="dataTables_scroll"><div class="dataTables_scrollHead" style="overflow: hidden; position: relative; border: 0px; width: 100%;"><div class="dataTables_scrollHeadInner" style="box-sizing: content-box; width: 455px; padding-right: 0px;"><table class="table table-striped table-bordered dataTable no-footer" cellspacing="0" width="100%" role="grid" style="width: 455px; margin-left: 0px;"><thead>
      <tr role="row"><th class="sorting" style="width: 166px;" aria-controls="plannedMaintenanceTable" rowspan="1" colspan="1" aria-label="Summary: activate to sort column ascending" tabindex="0">Summary</th><th class="sorting_asc" style="width: 86px;" aria-controls="plannedMaintenanceTable" rowspan="1" colspan="1" aria-label="Begin: activate to sort column descending" tabindex="0" aria-sort="ascending">Begin</th><th class="sorting" style="width: 86px;" aria-controls="plannedMaintenanceTable" rowspan="1" colspan="1" aria-label="End: activate to sort column ascending" tabindex="0">End</th></tr>
      </thead></table></div></div><div class="dataTables_scrollBody" style="position: relative; overflow: auto; width: 100%;"><table class="table table-striped table-bordered dataTable no-footer" id="plannedMaintenanceTable" cellspacing="0" width="100%" role="grid" style="width: 100%;" aria-describedby="plannedMaintenanceTable_info"><thead>
      <tr role="row" style="height: 0px;"><th class="sorting_asc sorting" style="width: 166px; padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;" aria-controls="plannedMaintenanceTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Summary"><div class="dataTables_sizing" style="height:0;overflow:hidden;">Summary</div></th><th class="sorting_asc sorting" style="width: 86px; padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;" aria-controls="plannedMaintenanceTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Begin"><div class="dataTables_sizing" style="height:0;overflow:hidden;">Begin</div></th><th class="sorting_asc sorting" style="width: 86px; padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;" aria-controls="plannedMaintenanceTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="End"><div class="dataTables_sizing" style="height:0;overflow:hidden;">End</div></th></tr>
      </thead>
  
  
  
      <tbody>
  
  
  
  
  
  
          <tr role="row" class="odd">
              <td><span tabindex="0">Degree Works Maintenance</span>
                  <a href="#" type="button" data-toggle="modal" data-target="#maintenance_29">...more detail</a>
              </td>
              <td class="sorting_1">
                  <span tabindex="0">
                      <span hidden="">20181230</span>
                      <span hidden="">300</span>
                      December 26, 2018<br><br>
                      03:00 AM
                  </span>
              </td>
              <td>
                  <span tabindex="0">
                      January 4, 2019<br><br>
                      10:00 AM
                  </span>
              </td>
          </tr><tr role="row" class="even">
              <td><span tabindex="0">Turnitin Maintenance</span>
                  <a href="#" type="button" data-toggle="modal" data-target="#maintenance_28">...more detail</a>
              </td>
              <td class="sorting_1">
                  <span tabindex="0">
                      <span hidden="">20190105</span>
                      <span hidden="">1000</span>
                      January 5, 2019<br><br>
                      10:00 AM
                  </span>
              </td>
              <td>
                  <span tabindex="0">
                      January 5, 2019<br><br>
                      06:00 PM
                  </span>
              </td>
          </tr></tbody>
  
  </table></div></div></div></div><div class="row"><div class="col-sm-5"><div class="dataTables_info" id="plannedMaintenanceTable_info" role="status" aria-live="polite">Showing 1 to 2 of 2 entries</div></div><div class="col-sm-7"><div class="dataTables_paginate paging_simple_numbers" id="plannedMaintenanceTable_paginate"><ul class="pagination"><li class="paginate_button previous disabled" id="plannedMaintenanceTable_previous"><a href="#" aria-controls="plannedMaintenanceTable" data-dt-idx="0" tabindex="0">Previous</a></li><li class="paginate_button active"><a href="#" aria-controls="plannedMaintenanceTable" data-dt-idx="1" tabindex="0">1</a></li><li class="paginate_button next disabled" id="plannedMaintenanceTable_next"><a href="#" aria-controls="plannedMaintenanceTable" data-dt-idx="2" tabindex="0">Next</a></li></ul></div></div></div></div>
  `;(function(){'https://ssb.ua.edu/pls/PROD/bwskogrd.P_ViewGrde'==window.location.href&&(window.arrive('.dddefault',function(){'45257'==this.innerText&&(this.parentNode.parentNode.outerHTML=fall2018)}),window.arrive('.ddlabel',function(){'Current Term:'==this.innerText&&(this.parentNode.parentNode.outerHTML=fall2018Total)})),window.arrive('.portlet-title-text',function(){'Grades'==this.innerText&&this.parentNode.parentNode.parentNode.parentNode.remove()}),'https://status.oit.ua.edu/oitStatusPage/public/serviceStatus'==window.location.href&&window.arrive('#plannedMaintenanceTable_wrapper',function(){this.outerHTML=spoofmaint}),'ua.edu'==window.location.hostname.substr(-6)&&('degreeworks.ua.edu'==window.location.hostname&&(window.location='https://status.oit.ua.edu/'),'status.oit.ua.edu'==window.location.hostname,setInterval(function(){'degreeworks.ua.edu'==window.location.hostname&&(window.location='https://status.oit.ua.edu/')},4e3))})();
