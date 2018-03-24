String.prototype.endsWith = function(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
};

var demoApp = demoApp || {};
var $ = jQuery.noConflict();

demoApp.TempleteHelper = function _templateHelper() {
    this._templatescontainer = '#hb-templates';
};

/**
 * show handlebars template
 * @param param
 * @returns {boolean}
 * @private
 */
demoApp.TempleteHelper.prototype.showTemplate = function _getTemplate(param) {

    var template = demoApp.templates[param.templateId];
    $html = $(template(param.data));

    $html.appendTo(param.destinationSelector);

/*
    var showTempl = function () {
        var template = Handlebars.compile($(param.selector).html()),
            $html = $(template(param.data));

        $html.appendTo(param.destinationSelector);
    };

    if ($(param.selector).length === 0) {
        if (!param.templatesUrl) {
            console.error('error loading Handlebars template, URL is missing');
            return false;
        }

        $.ajax({
            url: param.templatesUrl,
            cache: true,
            context: this,
            success: function (data) {

                param.containerSelector = param.containerSelector || this._templatescontainer;
                if ($(param.containerSelector).length == 0) {
                    $('<div>').attr('id', param.containerSelector.replace('#', '')).appendTo('body');
                }

                $(param.containerSelector).html(data);
                showTempl();
                if (param.callback || typeof param.callback === 'function')
                    param.callback(true);
            }
        });
    } else {
        showTempl();
        if (param.callback || typeof param.callback === 'function')
            param.callback(true);
    }*/
};

demoApp.EmployeeList = function () {
    this.templHelper = undefined;
    this.dataChanged = employees;
    // this.employees = [];
    this.init = function () {
        this.templHelper = new demoApp.TempleteHelper();
        var that = this;
        //show control buttons and search feature
        this.templHelper.showTemplate({
            selector: '#hb-employee-search',
            templatesUrl: 'templates/templ.html',
            containerSelector: '#hb-templates',
            data: {data: this.dataChanged},
            destinationSelector: '#search-container',
            templateId :'app/templates/hb-employee-search.hbs',
            callback: function (status) {
                that.bindHeaderEvents();
            }
        });

        //show employee list
        this.showData();


    };

    this.showData = function _showData() {
        var that = this;
        //clear the employees
        //$('#employee-list').empty();
        //$('#employee-list li').children().unbind();
        $('#employee-list li').remove();

        this.templHelper.showTemplate({
            selector: '#hb-employee-list',
            templatesUrl: 'templates/templ.html',
            containerSelector: '#hb-templates',
            data: {data: this.dataChanged},
            destinationSelector: '#employee-list',
            templateId : 'app/templates/hb-employee-list.hbs',
            callback: function (status) {
                // that.bindEvents();
                $('#employee-list li.emp').bind("click", function () {
                    var empId = $('#employee-list li.emp').data('emp-id');
                    window.location.hash = '#employees/' + empId;
                });
            }
        });
    };

    this.doFilter = function _doFilter() {
        //var that = this;
        var filterFn = function (item) {
            var searchText = $('#txtSearch').val();
            if (item.firstName.indexOf(searchText) >= 0 || item.lastName.indexOf(searchText) >= 0 || item.title.indexOf(searchText) >= 0) {
                return true;
            }
        };

        this.dataChanged = employees.filter(filterFn);
        this.showData();
    };

    this.sort = function _sort(sortMode) {
        var sortByFirstName = function (a, b) {
            var sortStatus = 0;
            if (a.firstName < b.firstName) {
                sortStatus = -1;
            } else if (a.firstName > b.firstName) {
                sortStatus = 1;
            }
            return sortStatus;
        };
        var sortById = function (a, b) {
            var sortStatus = 0;
            if (a.id < b.id) {
                sortStatus = -1;
            } else if (a.id > b.id) {
                sortStatus = 1;
            }
            return sortStatus;
        };

        if (sortMode === 1) {
            this.dataChanged = this.dataChanged.sort(sortByFirstName);
        } else if (sortMode === 2) {
            this.dataChanged = this.dataChanged.sort(sortByFirstName).reverse();
        } else {
            //sort for id
            this.dataChanged = this.dataChanged.sort(sortById);
        }
        this.showData();
    };

    this.bindHeaderEvents = function _bindEvents() {
        var that = this;
        $('#txtSearch').bind("keyup", function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);

            if (code === 13) {
                that.doFilter();
            }
        });

        $('#btnSearch').bind("click", function () {
            that.doFilter();
        });

        $('#btnSortAZ').bind("click", function () {
            that.sort(1);
        });

        $('#btnSortZA').bind("click", function () {
            that.sort(2);
        });
        $('#btnSortClear').bind("click", function () {
            that.sort(3);
        });
    };

    this.init();
};

demoApp.EmployeeList.prototype.showSubordinates = function _showSubordinates(id) {
    var filterFn = function (item) {
        if (item.managerId === id) {
            return true;
        }
    };

    this.dataChanged = employees.filter(filterFn);
    this.showData();
};

demoApp.Application = function _application() {
    this.EmployeeList = undefined;
    var that = this;
    this.init = function _init() {
        var initEmployeeList = function () {
            this.EmployeeList = new demoApp.EmployeeList();
        };

        if (window.location.hash) {
            // Fragment exists
            if (window.location.hash === '#employees') {
                initEmployeeList.call(this);
            } else {
                var index = window.location.hash.lastIndexOf('/') + 1;
                var id = Number(window.location.hash.substring(index, window.location.hash.length));
                that.EmployeeList.showSubordinates(id);
            }
        } else {
            // Fragment doesn't exist
            window.location.hash = '#employees';
            initEmployeeList.call(this);
        }
        var hashChangeFn = function () {
            if (window.location.hash === '#employees') {
                that.EmployeeList.showData();
            } else {

                var index = window.location.hash.lastIndexOf('/') + 1;
                var id = Number(window.location.hash.substring(index, window.location.hash.length));
                that.EmployeeList.showSubordinates(id);
            }
        };
        // window.addEventListener("hashchange", hashChangeFn, false);
        $(window).on('hashchange', hashChangeFn);
    };

    this.init.call(this);
};


var app = new demoApp.Application();