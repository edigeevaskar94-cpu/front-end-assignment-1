"use strict";

$(document).ready(function () {
    console.log("jQuery is ready!");

    // Task 2: Autocomplete - Services

    const services = [
        "Yacht Rental",
        "Luxury Cruises",
        "Events & Parties",
        "Captain Service",
        "Yacht Preparation",
        "Private Trips"
    ];

    const $search = $("#a5-search");
    const $suggestions = $("#y6-suggestions");

    $search.on("input", function () {
        const query = $(this).val().toLowerCase().trim();

        $suggestions.empty().hide();

        if (!query) return;

        const matches = services.filter(function (service) {
            return service.toLowerCase().includes(query);
        });

        matches.forEach(function (service) {
            const $button = $("<button>", {
                type: "button",
                class: "y6-suggestion"
            });

            $button.text(service);
            $suggestions.append($button);
        });

        if (matches.length) {
            $suggestions.show();
        }
    });

    $suggestions.on("click", ".y6-suggestion", function () {
        const input = $search[0];

        input.value = $(this).text();

        // Notify the existing Assignment 5 search.
        input.dispatchEvent(new Event("input", {
            bubbles: true
        }));

        $suggestions.hide();
    });


    // Task 5: Animated Counter - About

    const $counters = $(".y6-count");
    let countersStarted = false;

    function startCounters() {
        if (!$counters.length || countersStarted) return;

        const visibleBottom =
            $(window).scrollTop() + $(window).height();

        const counterTop = $counters.first().offset().top;

        if (visibleBottom < counterTop) return;

        countersStarted = true;

        $counters.each(function () {
            const $counter = $(this);
            const target = Number($counter.data("target"));

            $({ value: 0 }).animate(
                { value: target },
                {
                    duration: 1500,

                    step: function () {
                        $counter.text(Math.floor(this.value));
                    },

                    complete: function () {
                        $counter.text(target);
                    }
                }
            );
        });
    }

    $(window).on("scroll resize", startCounters);
    startCounters();


    // Task 8: Copy to Clipboard - Profile

    $("#y6-copy-email").on("click", async function () {
        const email = $("#profileEmail").val().trim();
        const $result = $("#y6-copy-result");

        if (!email) {
            $result.text("Please enter an email first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(email);

            const $button = $(this);
            $button.text("✓ Copied!");
            $result.text("Email copied to clipboard!");

            setTimeout(function () {
                $button.text("Copy Email");
                $result.text("");
            }, 2000);

        } catch (error) {
            $result.text(
                "Clipboard unavailable. Try running the site on localhost."
            );
        }
    });
});