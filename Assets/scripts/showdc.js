showdc = {};
$(function () {
    showdc.common.init();
    showdc.header.init();
    showdc.search.init();

});

showdc.common = {
    init: function () {
    },
    getUrlParams: function () {
        var urlParams = [], hash;
        var q = document.URL.split('?')[1];
        if (q != undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                urlParams.push(hash[1]);
                urlParams[hash[0]] = hash[1];
            }
        }
        return urlParams;
    },
    modal: {
        show: function (target) {
            setTimeout(function () {
                $('#layout_modal_button').attr('data-target', '#' + target);
                $('#layout_modal_button').click();
            }, 50);
        },
        hide: function (target) {
            $('#' + target).find('button.close')[0].click();
        },
        confirm: function (title, content, callBack, callBackCancel) {
            $('#layout_modal_confirm').find('.modal-title').html(title);
            $('#layout_modal_confirm').find('.modal-content-info').html(content);

            if (typeof callBack === "function") {
                //$('#layout_modal_confirm').unbind('hidden.bs.modal');               
                $('#layout_modal_confirm').find('.confirm-yes').bind('click', callBack);
            }
            if (typeof callBackCancel === "function") {
                //$('#layout_modal_confirm').find('.confirm-no').bind('click', callBackCancel);
                $('#layout_modal_confirm').on('hidden.bs.modal', function () {
                    callBackCancel();
                })
            }
            showdc.common.modal.show('layout_modal_confirm');
        },
        alert: function (title, content) {
            $('#layout_modal_info').find('.modal-title').html(title);
            $('#layout_modal_info').find('.modal-content-info').html(content);
            //$('#layout_modal_info').find('.confirm-yes').attr('onclick', callBack);
            showdc.common.modal.show('layout_modal_info');
        },
    },
}
showdc.account = {
    labelShowText: 'Show Password',
    labelHideText: 'Hide Password',
    init: function () {
        this.showHidePassword();
    },
    showHidePassword: function () {
        $("#showHidePassword").click(function () {
            var isShow = $(this).attr("data-is-show");
            if (isShow != '') {
                $(this).find('span').html(showdc.account.labelHideText + ' <i class="fa fa-eye-slash" aria-hidden="true"></i>');
                $("#Password").attr('type', 'text');
                $("#ConfirmPassword").attr('type', 'text');
                $(this).attr('data-is-show', '');
            }
            else {
                $(this).find('span').html(showdc.account.labelShowText + ' <i class="fa fa-eye" aria-hidden="true"></i>');
                $("#Password").attr('type', 'password');
                $("#ConfirmPassword").attr('type', 'password');
                $(this).attr('data-is-show', '1');
            }
        });
    }
}
showdc.article = {
    init: function () {
        var subCategoryId = '';
        var urlParams = showdc.common.getUrlParams();
        if (urlParams['subcategoryId'] != undefined) {
            subCategoryId = urlParams['subcategoryId'];
            $('.stores-brand-dir-nav .btn-filter').each(function (index, item) {
                if ($(item).attr("catId").toLowerCase() == urlParams['subcategoryId'].toLowerCase()) {
                    $(item).addClass("active");
                }
                else {
                    $(item).removeClass("active");
                }
            });
        }

        this.searchWhatsNew(1, subCategoryId);
        $(".btn-filter").click(function () {
            var categoryId = $(this).attr("catId");
            showdc.article.searchWhatsNew(1, categoryId);
        });
    },
    searchWhatsNewPaging: function (pageIndex) {
        var categoryId = '';
        $('.btn-filter').each(function () {
            if ($(this).hasClass('active')) {
                categoryId = $(this).attr('catid');
                if (typeof categoryId == 'undefined') {
                    categoryId = '';
                }
            }
        });
        this.searchWhatsNew(pageIndex, categoryId);
    },
    searchWhatsNew: function (pageIndex, categoryId) {
        var data = { categoryId: categoryId, pageIndex: pageIndex };

        $.ajax({
            type: "POST",
            url: '/Rendering/SearchWhatsNew',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.IsError == false && (undefined != response.HTML && "" !== response.HTML)) {
                    $("#SearchResult").html(response.HTML);
                } else {
                    $("#SearchResult").html(response.HTML);
                }
            },
            error: function () {
                console.log("An error occurred while searching for article!");
            }
        });
    }
}
showdc.pressroom = {
    init: function () {

        this.searchPressRoom(1, null, null);
        $("#HiddenPageIndex").text(1);

        $("#YearFilter").change(function () {
            $("#HiddenPageIndex").text(1);
            var year = $("#YearFilter option:selected").val();
            var keyword = $("#PressRoomKeyword").val();
            var pageIndex = $("#HiddenPageIndex").text();
            showdc.pressroom.searchPressRoom(pageIndex, year, keyword);
        });

        $("#SearchButton").click(function () {
            $("#HiddenPageIndex").text(1);
            var year = $("#YearFilter option:selected").val();
            var keyword = $("#PressRoomKeyword").val();
            var pageIndex = $("#HiddenPageIndex").text();
            showdc.pressroom.searchPressRoom(pageIndex, year, keyword);
        });

        $("#PressRoomKeyword").bind("keypress", function (e) {
            if (e.keyCode === 13) {  // Enter key
                $("#HiddenPageIndex").text(1);
                var year = $("#YearFilter option:selected").val();
                var keyword = $("#PressRoomKeyword").val();
                var pageIndex = $("#HiddenPageIndex").text();
                showdc.pressroom.searchPressRoom(pageIndex, year, keyword);
                return false; // prevent the page reload after Enter key is pressed
            }
        });
        
    },
    searchPressRoomPaging: function (pageIndex) {
        var year = $("#YearFilter option:selected").val();
        var keyword = $("#PressRoomKeyword").val();
        $("#HiddenPageIndex").text(pageIndex);
        this.searchPressRoom(pageIndex, year, keyword);
    },
    searchPressRoom: function (pageIndex, year, keyword) {
        var data = { keyword: keyword, year: year, pageIndex: pageIndex };

        $.ajax({
            type: "POST",
            url: '/Rendering/SearchPressRoom',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.IsError == false && (undefined != response.HTML && "" !== response.HTML)) {
                    $("#SearchResult").html(response.HTML);
                } else {
                    $("#SearchResult").html(response.HTML);
                }
            },
            error: function () {
                console.log("An error occurred while searching for pressroom article!");
            }
        });
    }
}
showdc.events = {
    init: function () {
        this.searchEvents();
        $("#SearchButton").click(function () {
            showdc.events.searchEvents();
        });

        $("#eventname").bind("keypress", function (e) {
            if (e.keyCode === 13) {  // Enter key
                showdc.events.searchEvents();
                return false; // prevent the page reload after Enter key is pressed
            }
        });
        $("#thisweekbtn").click(function () {
            showdc.events.ActiveButton("1");
            showdc.events.searchEvents();
            
        });
        $("#nextweekbtn").click(function () {
            showdc.events.ActiveButton("2");
            showdc.events.searchEvents();
        });
        $("#allweekbtn").click(function () {
            showdc.events.ActiveButton("3");
            showdc.events.searchEvents();
        });
    },
    searchEvents: function (pagenumber) {
        var allweek = $("#allweekbtn").hasClass("active") ? 1 : 0;
        var thisWeek = $("#thisweekbtn").hasClass("active") ? 1 : 0;
        var nextWeek = $("#nextweekbtn").hasClass("active") ? 1 : 0;
        var data = { keyword: $("#eventname").val(), thisweek: thisWeek, nextweek: nextWeek, allWeek:allweek, pageindex: pagenumber };

        $.ajax({
            type: "POST",
            url: '/Rendering/SearchEvents',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.IsError == false && (undefined != response.HTML && "" !== response.HTML)) {
                    $("#SearchResult").html(response.HTML);
                } else {
                    $("#SearchResult").html(response.HTML);
                }
            },
            error: function () {
                console.log("An error occurred while searching for events!");
            }
        });
    },
    ActiveButton: function (index) {
        if (index === "1") {
            $("#thisweekbtn").addClass("active");
            $("#nextweekbtn").removeClass("active");
            $("#allweekbtn").removeClass("active");
        }
        else if (index === "2") {
            $("#thisweekbtn").removeClass("active");
            $("#nextweekbtn").addClass("active");
            $("#allweekbtn").removeClass("active");
        } else {
            $("#thisweekbtn").removeClass("active");
            $("#nextweekbtn").removeClass("active");
            $("#allweekbtn").addClass("active");
        }
        
    }
}
showdc.header = {
    init: function () {
        this.getUserLocation();

    },
    getUserLocation: function () {
        $.ajax({
            type: "GET",
            url: "/Rendering/Home",
            contentType: "application/json",
            data: {},
            success: function (response) {
                console.log("success get location");
            },
            error: function () {
                console.log("error");
            }

        });
    },


}
showdc.search = {
    init: function () {
        this.search();
        this.categoryInit();

        $('.search-cta').on('click', function (e) {
            setTimeout(function () {
                $('#input-global-search').focus();
            }, 300);
        });
    },


    categoryInit: function () {
        $('.category-search').click(function () {
            var linkHref = $(this).attr('data-href');
            if ($("#keyword").val() != '') {
                var keyword = encodeURIComponent($("#keyword").val());
                if (linkHref.includes("?")) {
                    linkHref += "&keyword=" + keyword;
                }
                else {
                    linkHref += "?keyword=" + keyword;
                }
            }
            location.href = linkHref;

        });
    },
    search: function () {
        $("#btn-global-search").click(function () {
            var keyword = $('.search-input').val();
            if (typeof keyword != 'undefined' && keyword != '') {
                keyword = encodeURIComponent(keyword);
                location.href = "/search?keyword=" + keyword;
            }
        });
        $('#input-global-search').on("keypress", function (e) {

            if (e.keyCode == 13) {
                // Cancel the default action on keypress event
                e.preventDefault();
                var keyword = $('.search-input').val();

                if (typeof keyword != 'undefined' && keyword != '') {
                    keyword = encodeURIComponent(keyword);
                    location.href = "/search?keyword=" + keyword;
                }
            }
        });
    },
    globalSearchPaging: function (pageIndex) {
        var keyword = encodeURIComponent($("#keyword").val());
        location.href = "/search?keyword=" + keyword + "&type=" + $("#type").val() + "&pageIndex=" + pageIndex;
    }

}
showdc.home = {
    init: function () {
    },

    activeFirstCarousel: function () {
        $("ul.nav-tabs li:first-child").addClass("active");
        $("div.tab-content div.tab-pane:first-child").addClass("active in");
    }
}
showdc.shopListing = {
    init: function () { },

    redirectToPath: function (item) {
        window.location.href = $(item).attr("path");
    },
    searchShops: function (pageIndex) {
        $("#HiddenPageIndex").text(pageIndex);
        var selectedCategoryOption = $("#CategoryFilter option:selected").val();
        var selectedStoreInitialOption = $("#AlphanumericFilter option:selected").val();
        var keyword = $("#StoreName").val();
        var mainCategory = null;
        var filterByMainCategory = $("#HiddenFilterByMainCategory").val();
        if (selectedCategoryOption === "0" && filterByMainCategory === "True") {
            mainCategory = $("#HiddenMainCategoryId").val();
        }
        if (selectedCategoryOption === undefined || selectedCategoryOption === "0") {
            selectedCategoryOption = null;
        }

        if (selectedStoreInitialOption === undefined || selectedStoreInitialOption === "0") {
            selectedStoreInitialOption = null;
        }
        if (keyword === undefined) {
            keyword = '';
        }

        if (mainCategory === undefined) {
            mainCategory = null;
        }
        var level = $("#HiddenLevel").text();
        params = { category: selectedCategoryOption, startWith: selectedStoreInitialOption, mainCategory: mainCategory, keyword: keyword, level: level, pageIndex: $("#HiddenPageIndex").text() };
        SearchStores(params);
    }
}
showdc.myaccount = {
    init: function () {

    },
    social_change: function (sender) {
        if ($(sender).prop('checked')) {
            window.location = $(sender).attr('social_url');
        }
        else {
            var vendor = '';
            if (sender.id == 'ck_connect_facebook') {
                vendor = 'facebook';
            }
            else if (sender.id == 'ck_connect_google') {
                vendor = 'google';
            }
            else if (sender.id == 'ck_connect_weibo') {
                vendor = 'weibo';
            }
            $('.social-panel-conection .social-msg-container').hide();
            $.ajax({
                type: "POST",
                url: '/Rendering/TurnOfSocialConnect?vendor=' + vendor,
                contentType: "application/json",
                data: {},
                success: function (response) {

                    if (!response.IsSuccess) {
                        if (response.Vendor == "facebook" && response.Message != null && response.Message != '') {
                            $('.facebook-connect-row .social-msg-container').show();
                            $('.facebook-connect-row .social-msg-container .message').html(response.Message);
                            $('#ck_connect_facebook').prop('checked', true);
                        }
                        else if (response.Vendor == "google" && response.Message != null && response.Message != '') {
                            $('.google-connect-row .social-msg-container').show();
                            $('.google-connect-row .social-msg-container .message').html(response.Message);
                            $('#ck_connect_google').prop('checked', true);
                        }
                        else if (response.Vendor == "weibo" && response.Message != null && response.Message != '') {
                            $('.weibo-connect-row .social-msg-container').show();
                            $('.weibo-connect-row .social-msg-container .message').html(response.Message);
                            $('#ck_connect_weibo').prop('checked', true);
                        }
                        console.log("An error occurred while turn of social connect!");
                    }

                },
                error: function () {
                    console.log("An error occurred while turn of social connect!");
                }
            });
        }
    }
}
showdc.myAccountNavigation = {
    init: function () {
        $('.redirectToPath').click(function () {
            if (!$(this).hasClass('current'))
                window.location.href = $(this).attr("href");
        });
    }
}
showdc.eTicket = {
    lastScrollTop: 0,
    pageIndex: 1,
    isShowMore: "true",
    isSuccess: true,
    url: "",
    isLoading: false,
    init: function () {
        //this.searchShows(null, null, null, 1);
        InitSearch();

        function CheckVisible(elm) {
            var rect = elm.getBoundingClientRect();
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
        };
        function GetMoreTickets() {
            showdc.eTicket.isLoading = true;
            if (showdc.eTicket.isShowMore == "true" && showdc.eTicket.isSuccess) {
                showdc.eTicket.pageIndex++;
                var keyword = $("#ETicketSearchKeyword").val();
                var categoryId = $("#ETicketCategoryFilter option:selected").val();
                var sortBy = $("#ETicketSortBy option:selected").val();
                showdc.eTicket.searchShows(keyword, categoryId, sortBy, showdc.eTicket.pageIndex, true);
            }
        };

        function InitSearch() {
            var keyword = $("#ETicketSearchKeyword").val();
            var categoryId = $("#ETicketCategoryFilter option:selected").val();
            var sortBy = $("#ETicketSortBy option:selected").val();
            showdc.eTicket.pageIndex = 1;
            showdc.eTicket.searchShows(keyword, categoryId, sortBy, showdc.eTicket.pageIndex, false);
        };

        window.onscroll = function () {
            var loadmore = document.getElementById('loadmore');
            CheckVisible(loadmore) && showdc.eTicket.isLoading == false ? GetMoreTickets() : '';
        };

        $("#ETicketCategoryFilter").change(function () {
            InitSearch();
        });

        $("#ETicketSortBy").change(function () {
            InitSearch();
        });

        $("#ETicketSearchButton").click(function () {
            InitSearch();
        });

        $("#ETicketSearchKeyword").bind("keypress", function (e) {
            if (e.keyCode === 13) {  // Enter key
                InitSearch();
                return false; // prevent the page reload after Enter key is pressed
            }
        });

    },
    searchShows: function (keyword, categoryId, sortBy, pageIndex, isLoadMore) {
        var data = { keyword: keyword, sortBy: sortBy, categoryId: categoryId, pageIndex: pageIndex };

        $.ajax({
            type: "POST",
            url: '/Rendering/SearchShows',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                showdc.eTicket.isSuccess = true;
                showdc.eTicket.isShowMore = response.IsShowMore;
                if (response.IsError == false && undefined != response.HTML) {
                    //if (isLoadMore) {
                    //    $("#SearchResult").append(response.HTML);
                    //} else {
                    //    $("#SearchResult").html(response.HTML);
                    //}
                    if (pageIndex == 1) {
                        if (response.HTML == "") {
                            //Todo: get error message from Sitecore
                            var emptyResultMessage = "No result found.";
                            $("#SearchResult").html(emptyResultMessage);
                        }
                        else {
                            $("#SearchResult").html(response.HTML);
                        }
                    }
                    else {
                        $("#SearchResult").append(response.HTML);
                    }
                }
                showdc.eTicket.isLoading = false;
            },
            error: function () {
                console.log("An error occurred while searching for shows!");
            }
        });
    },
};

showdc.ticketDetail = {

    rebook: 'false',
    closedShowTitle: 'Notification!',
    closedShowMessage: 'This show is temporary closed. Please try again later.',
    uncheckingShowTimeTitle: 'Warning!',
    uncheckingShowTimeMessage: 'You must select Showtime before selecting zone',
    placeBookingErrorTitle: "Error",
    placeBookingErrorMessage: 'An error occurred while place booking.',
    changeZoneConfirmTitle: 'Warning',
    changeZoneConfirmMessage: 'Would you like change selected zone?',
    hasApiServerErrorTitle: 'Warning!',
    hasApiServerErrorMessage: 'Oops! Sorry, Something wrong. Please try again later.',
    warningPopupTitle: "Warning!",
    hasApiServerError: 'False',
    unavailableShow: 'False',
    currentTicketZoneId: '',
    booking: {},
    showId: 0,
    theFirstGotoPage: true,
    showTimes: [],
    disabledShowDate: [],
    currentShowTimes: [],
    initCountDownTimer: false,
    stopCountDown: function () {
        if ($("#stopBtn_ms").val() == "start") {
            $("#stopBtn_ms").click();
        }
    },
    restartCountDown: function () {
        if (!showdc.ticketDetail.initCountDownTimer) {
            showdc.ticketDetail.initCountDownTimer = true;
            $("#ms_timer").countdowntimer({
                minutes: showdc.ticketDetail.booking != null ? showdc.ticketDetail.booking.TimeoutPeriod : 10
               , seconds: 0
               , expiryUrl: document.location.href
               , stopButton: 'stopBtn_ms'
            });
        }
        else {
            if ($("#stopBtn_ms").val() == "stop") {
                $("#stopBtn_ms").click();
            }
            else {
                $("#stopBtn_ms").click();
                $("#stopBtn_ms").click();
            }
        }

    },
    init: function () {
        this.applyRefererCode();
        this.onChangeDatePicker();
        $(document).ready(function () {

            $('.one-column').addClass('ticket-detail');
            // display sign in error in Sign In modal
            if ($('#HiddenIsRedirectedFromSignInModal').val() !== "") {
                if ($('#HiddenSignInError').val() !== "") {
                    $('#login-modal').modal('show');
                    $('.advice').show();
                }
            }
            else {
                if ($('#SignInSuccess').val() == "True") {
                    $(window).load(function () {
                        //if (showdc.ticketDetail.currentShowTimes == null || showdc.ticketDetail.currentShowTimes.length == 0 || showdc.ticketDetail.hasAvailableTime(showdc.ticketDetail.currentShowTimes)) {
                        //    setTimeout(function () { $('#ticket-select-date-time').addClass('active'); }, 500);
                        //}
                        //else {
                        //    $('#ticket-select-date-time, #ticket-select-quantity, #ticket-select-zone').each(function (index, element) {
                        //        setTimeout(function () { $(element).addClass('active'); }, 500 * index)
                        //    });
                        //}

                        //$('html, body').animate({
                        //    scrollTop: $('#ticket-select-date-time').offset().top - ($('#header').height() + 100 + $('html, body').offset().top + $('html, body').scrollTop())
                        //}, 1000);
                        showdc.ticketDetail.showNextStep();
                    });
                }
            }

            // hide error message on modal closed
            $('#login-modal').on('hidden.bs.modal', function () {
                $('.advice').hide();
            });

            $('.btn-ticket-payment').on('click', function () {
                $('#hasConfirmLeavePage').val("0");
                localStorage.setItem('checkSum', $("#submitPayment").serialize());
                document.SubmitForm.submit();
            });

            //

            //
            $(window).on('beforeunload', function (e) {
                var confirmationMessage = "Are you sure you want to leave?";
                if ($('#hasConfirmLeavePage').val() == "1") {
                    e.returnValue = confirmationMessage;
                    return confirmationMessage;
                }
            });
        });
        showdc.ticketDetail.bookTicket();

    },
    bookTicket: function () {
        $("#book-ticket").on('click', function () {
            if (showdc.ticketDetail.hasApiServerError == "True") {
                //TODO: Get message from sitecore content
                showdc.common.modal.alert(showdc.ticketDetail.hasApiServerErrorTitle, showdc.ticketDetail.hasApiServerErrorMessage);
            }
            else if (showdc.ticketDetail.unavailableShow == "True") {
                showdc.common.modal.alert(showdc.ticketDetail.closedShowTitle, showdc.ticketDetail.closedShowMessage);
            }
            else {
                showdc.ticketDetail.showNextStep();
            }

        });
        $(".ticket-zone-radio").on('change', function () {

            var placeBooking = function (data) {
                showdc.ticketDetail.placeBooking(data, function () {
                    showdc.ticketDetail.currentTicketZoneId = $(self).attr("id");
                    $('#ticket-preview, #ticket-confirm, #ticket-preview-timer').each(function (index, element) {
                        setTimeout(function () { $(element).addClass('active').removeClass("hidden"); }, 500 * index)
                    });
                    $('html, body').animate({
                        scrollTop: $('#ticket-preview').offset().top - ($('#header').height() + 100 + $('html, body').offset().top)
                    }, 800);

                    //var image = "<img src='" + $(self).attr('map-data') + "' class='img-responsive'>";
                    $(".ticket-preview-image").attr("src", $(self).attr('map-data'));
                    showdc.ticketDetail.restartCountDown();
                });
            };
            var callBackCancel = function () {
                if (showdc.ticketDetail.currentTicketZoneId != '') {
                    $("#" + showdc.ticketDetail.currentTicketZoneId).prop("checked", true);
                }
                else {
                    $('input[name=ticket-zone]:checked').prop("checked", false);
                }

            };
            var self = $(this);
            if ($('input[name=ticketShowtime]:checked').length > 0) {
                var showTimeId = $('input[name=ticketShowtime]:checked').val();
                var hallZoneId = $('input[name=ticket-zone]:checked').val();
                var seatCount = $("#ticket-quantity").val();

                if ($('input[name=ticket-zone]:checked').length > 0 && showdc.ticketDetail.booking != null && showdc.ticketDetail.booking.OrderId > 0) {
                    showdc.common.modal.confirm(showdc.ticketDetail.changeZoneConfirmTitle, showdc.ticketDetail.changeZoneConfirmMessage, function () {
                        $('#layout_modal_confirm').off('hidden.bs.modal');
                        var data = { showTimeId: showTimeId, hallZoneId: hallZoneId, seatCount: seatCount, orderCancelledId: showdc.ticketDetail.booking.OrderId };
                        placeBooking(data);

                    }, function () { callBackCancel(); })
                }
                else {
                    var data = { showTimeId: showTimeId, hallZoneId: hallZoneId, seatCount: seatCount };
                    placeBooking(data);
                }
                //$(window).on('beforeunload', function (e) {
                //    var confirmationMessage = "Are you sure you want to leave?";
                //    e.returnValue = confirmationMessage;
                //    return confirmationMessage;
                //});

            }
            else {
                $('input[name=ticket-zone]:checked').prop("checked", false);
                // TODO: alert
                showdc.common.modal.alert(showdc.ticketDetail.uncheckingShowTimeTitle, showdc.ticketDetail.uncheckingShowTimeMessage);
                //alert("You must select timeslot before selecting zone");
                //showdc.common.modal.confirm("Warning!", "Would you like change selected zone?", function () { });
            }

        });
        $("#ticket-confirm").on('click', '#confirm-ticket', function () {
            $('#ticket-payment').each(function (index, element) {
                setTimeout(function () { $(element).addClass('active'); }, 500 * index)
            });
            $('html, body').animate({
                scrollTop: $('#ticket-payment').offset().top - ($('#header').height() + 100 + $('html, body').offset().top)
            }, 800);
        });
    },
    onChangeDatePicker: function () {
        $("#ticket-select-date").on("dp.change", function (e) {
            // get current show times
            var currentDay = moment(e.date).format('DD');
            var currentMonth = moment(e.date).format('MMM YYYY');
            $('.currentDay').html(currentDay);
            $('.currentMonth').html(currentMonth);
            showdc.ticketDetail.currentShowTimes = showdc.ticketDetail.getCurrentShowTimes(moment(e.date).format('YYYY-MM-DD'));
            $('#ticket-quantity').val('1');
            showdc.ticketDetail.currentTicketZoneId = '';
            $('input[name=ticket-zone]:checked').prop("checked", false)
            // display show time events
            $("#ticket-showtime").html('');
            showdc.ticketDetail.fillCurrentShowTimes(showdc.ticketDetail.currentShowTimes);
            if (showdc.ticketDetail.currentShowTimes != null && showdc.ticketDetail.currentShowTimes.length > 0 && showdc.ticketDetail.hasAvailableTime(showdc.ticketDetail.currentShowTimes)) {
                if ($('#ticket-select-date-time').hasClass('active')) {
                    $("#ticket-select-quantity").addClass("active");
                    $("#ticket-select-zone").addClass("active");
                }

            }
            else {
                $("#ticket-select-quantity").removeClass("active");
                $("#ticket-select-zone").removeClass("active");
                $("#ticket-preview").removeClass("active");
                $("#ticket-confirm").removeClass("active");
                $("#ticket-preview-timer").removeClass("active");
                showdc.ticketDetail.stopCountDown();
            }
            if (showdc.ticketDetail.theFirstGotoPage) {
                setTimeout(function () {
                    $('#ticket-select-date').data("DateTimePicker").disabledDates(showdc.ticketDetail.disabledShowDate);
                    showdc.ticketDetail.theFirstGotoPage;
                }, 500)

            }
        });

        $("#ticket-select-date").on("dp.update", function (e) {
            var disableUnavailableShowDate = function () {
                showdc.ticketDetail.currentTicketZoneId = '';
                var disabledShowDate = showdc.ticketDetail.disabledShowDate;
                $('#ticket-select-date').data("DateTimePicker").disabledDates(disabledShowDate);
                //$.each(disabledShowDate, function (index, item) {

                //});
            };
            showdc.ticketDetail.getShowTimes(showdc.ticketDetail.showId, moment(e.viewDate).format("MM"), moment(e.viewDate).toDate().getFullYear(), disableUnavailableShowDate);

        });
    },
    fillCurrentShowTimes: function (currentShowTimes) {
        var showTimesHtml = '';
        if (currentShowTimes != null) {
            var isOnlyOneShowTime = showdc.ticketDetail.getAvailableTimeCount(currentShowTimes) == 1;
            var isFirst = true;
            $.each(currentShowTimes, function (key, item) {
                var checkedText = '';

                var showTimeCssStyle = item.total_num_of_seats_available <= 0 || !item.valid ? 'disabled' : '';
                if (isOnlyOneShowTime && isFirst && showTimeCssStyle == '') {
                    checkedText = 'checked'
                    isFirst = false;
                }
                showTimesHtml += '<div class="radio ' + showTimeCssStyle + '">';
                showTimesHtml += '<label>';
                if (showTimeCssStyle == '') {
                    showTimesHtml += '<input ' + checkedText + ' type="radio" name="ticketShowtime" value="' + item.id + '">';
                } else {
                    showTimesHtml += '<input type="radio" disabled name="ticketShowtime" value="' + item.id + '">';
                }
                debugger;

                showTimesHtml += '<div class="checked"></div>' + (moment(item.utc_start_time, 'HH:mm:ss').add(7, 'hour').locale('en')).format('HH:mm A');
                showTimesHtml += '</label>';
                showTimesHtml += '</div>';
            });
            $("#ticket-showtime").html(showTimesHtml);
        }
    },
    getCurrentShowTimes: function (selectedDateStr) {
        var currentShowTimes = [];
        if (showdc.ticketDetail.showTimes != null && showdc.ticketDetail.showTimes.length > 0) {
            $.each(showdc.ticketDetail.showTimes, function (key, item) {
                if (moment(item.date).format('YYYY-MM-DD') == selectedDateStr) {
                    currentShowTimes.push(item);
                }
            });
        }
        return currentShowTimes;
    },
    placeBooking: function (data, callback) {
        $.ajax({
            type: "POST",
            url: '/Rendering/PlaceBooking',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.isSuccess) {
                    var booking = response.booking;
                    showdc.ticketDetail.booking = booking;
                    if (booking)
                        var hallZoneName = $('input[name=ticket-zone]:checked').parent().find('.hallNameLbl').html();
                    var bookedTime = moment(booking.ShowDateTime).format('LLLL');
                    $('.seat').html(booking.BookedSeats != null ? booking.BookedSeats.join(', ') : '');
                    $('.subTotal').html($.number(booking.TicketsAmount.TotalTicketAmount, 2));
                    $('.ticketItemAmount').html("฿ " + $.number(booking.TicketsAmount.IndividualTicketPrice, 2) + " * " + booking.NumberOfSeats);
                    $('.zoneName').html(hallZoneName);
                    $('.bookedTime').html(bookedTime);
                    $('.discount-value').html(booking.DiscountAmount != null ? booking.DiscountAmount.DiscountedAmount : '');
                    $('.vat').html(booking.VatAmount != null ? booking.VatAmount.Vat_Amount : '');
                    $('.orderTotal').html($.number(booking.FinalAmount, 2));
                    $('#INVMERCHANT').val(booking.OrderId);
                    showdc.ticketDetail.getChecksumAndFinalAmount();
                    callback();
                }
                else {
                    if (typeof response.errorMsg != 'undefined' && response.errorMsg != '') {
                        showdc.common.modal.alert(showdc.ticketDetail.warningPopupTitle, response.errorMsg);
                    }
                    else {
                        showdc.common.modal.alert(showdc.ticketDetail.placeBookingErrorTitle, showdc.ticketDetail.placeBookingErrorMessage)
                    }
                }
            },
            error: function () {
                $('input[name=ticket-zone]:checked').prop("checked", false)
                console.log("An error occurred while place booking!");
            }
        });
    },
    getChecksumAndFinalAmount: function () {
        var amount = $('.orderTotal').html();
        var orderDetail = $('#DETAIL2').val();
        var invoiceNo = $('#INVMERCHANT').val();
        var returnUrl = $('#URL2').val();
        var data = { amount: amount, invoiceNo: invoiceNo, orderDetail: orderDetail, returnUrl: returnUrl };
        $.ajax({
            type: "POST",
            url: '/Rendering/CalculateCheckSumAndFinalAmount',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.isSuccess) {
                    $('#CHECKSUM').val(response.data.checkSum);
                    $('#AMOUNT2').val(response.data.finalAmount);
                    $('#IPCUST2').val(response.data.ipAddress);
                }
                else {
                    alert("An error occurred while confirming tickets");
                }
            },
            error: function () {
                console.log("An error occurred while confirming tickets");
            }
        });
    },
    applyRefererCode: function () {
        $('.shopper-code').click(function () {
            var refererCode = $("#refererCodeTxt").val();
            var data = { orderId: showdc.ticketDetail.booking.OrderId, refererCode: refererCode };
            $.ajax({
                type: "POST",
                url: '/Rendering/ApplyRefererCode',
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    if (response.isSuccess && response.booking != null) {
                        showdc.ticketDetail.booking = response.booking;
                        $('.discount-value').html(response.booking.DiscountAmount != null ? response.booking.DiscountAmount.DiscountedAmount : '');
                        $('.vat').html(response.booking.VatAmount != null ? response.booking.VatAmount.Vat_Amount : '');
                        $('.orderTotal').html($.number(response.booking.FinalAmount, 2));

                        var discountDecimal = parseFloat($('.discount-value').html());
                        if (!isNaN(discountDecimal) && discountDecimal > 0) {
                            $('#refererCodeTxt').attr('disabled', 'disabled');
                            $('.shopper-code').attr('disabled', 'disabled');
                        }
                    }
                },
                error: function () {
                    console.log("An error occurred while apply referer code!");
                }
            });
        });

    },
    getShowTimes: function (showId, month, year, callback) {
        var data = { showid: showId, month: month, year: year };
        $.ajax({
            type: "POST",
            url: '/Rendering/GetShowTimes',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response != null) {
                    showdc.ticketDetail.showTimes = JSON.parse(response.showTimes);
                    showdc.ticketDetail.disabledShowDate = JSON.parse(response.disabledShowDate);
                }
                else {
                    showdc.ticketDetail.showTimes = [];
                    showdc.ticketDetail.disabledShowDate = [];
                }

                if (typeof callback === "function") {
                    callback();
                }
            },
            error: function () {
                console.log("An error occurred while get showtimes!");
            }
        });
    },
    hasAvailableTime: function (showTimes) {
        var isAvailableTime = false;
        if (showTimes != null && showTimes.length > 0) {
            $.each(showTimes, function (index, item) {
                if (item.total_num_of_seats_available > 0 && item.valid) {
                    isAvailableTime = true;
                }
            });
            return isAvailableTime;
        }
        return false;
    },
    getAvailableTimeCount: function (showTimes) {
        var avaiableTimesCount = 0;
        if (showTimes != null && showTimes.length > 0) {
            $.each(showTimes, function (index, item) {
                if (item.total_num_of_seats_available > 0 && item.valid) {
                    avaiableTimesCount++;
                }
            });
            return avaiableTimesCount;
        }
        return false;
    },
    showNextStep: function () {
        if (showdc.ticketDetail.currentShowTimes == null || showdc.ticketDetail.currentShowTimes.length == 0 || !showdc.ticketDetail.hasAvailableTime(showdc.ticketDetail.currentShowTimes)) {
            setTimeout(function () { $('#ticket-select-date-time').addClass('active'); }, 500);
        }
        else {
            $('#ticket-select-date-time, #ticket-select-quantity, #ticket-select-zone').each(function (index, element) {
                setTimeout(function () { $(element).addClass('active'); }, 500 * index)
            });
        }
        $('html, body').animate({
            scrollTop: $('#ticket-select-date-time').offset().top - ($('#header').height() + 100 + $('html, body').offset().top)
        }, 800);
    },

}

showdc.myTicket = {
    removingTicketConfirmMessage: "You are removing your ticket, Please confirm.",
    init: function () {
        this.hideOrder();
    },
    hideOrder: function (orderId) {
        $('.hideOrder').click(function () {
            if (confirm(showdc.myTicket.removingTicketConfirmMessage)) {
                var self = $(this);
                var orderId = $(this).attr("data-orderid");
                var data = { orderId: orderId };
                $.ajax({
                    type: "POST",
                    url: '/Rendering/HideOrder',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (response) {
                        if (response.isSuccess) {
                            $(self).closest('.account-panel').remove();
                        }
                        else {
                            alert("An error occurred while process your request!")
                        }
                    },
                    error: function () {
                        console.log("An error occurred while hide order!");
                    }
                });
            }
        });
    }
}

showdc.deals = {
    init: function () {
        this.searchDeals();
        $("#SearchButton").click(function () {
            showdc.deals.searchDeals();
        });
        $("#categoryFilter").change(function () {
            showdc.deals.searchDeals();
        });
        $("#creditcardFilter").change(function () {
            showdc.deals.searchDeals();
        });
        $("#dealname").bind("keypress", function (e) {
            if (e.keyCode === 13) {  // Enter key
                showdc.deals.searchDeals();
                return false; // prevent the page reload after Enter key is pressed
            }
        });

    },
    searchDeals: function (pagenumber) {
        var category = $("#categoryFilter option:selected").val();
        var creditcard = $("#creditcardFilter option:selected").val();
        var data = { keyword: $("#dealname").val(), category: category, creditcard: creditcard, pageindex: pagenumber };

        $.ajax({
            type: "POST",
            url: '/Rendering/SearchDeals',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.IsError == false && (undefined != response.HTML && "" !== response.HTML)) {
                    $("#SearchResult").html(response.HTML);
                } else {
                    $("#SearchResult").html(response.HTML);
                }
            },
            error: function () {
                console.log("An error occurred while searching for deals!");
            }
        });
    }
}