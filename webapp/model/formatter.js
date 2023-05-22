sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },
        dateFormatter : function(sValue){
            var form = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYY-MM-dd"})
            return   form.format(sValue)

        },
        dateChart : function(sValue){
            return new Date(sValue)
        }

    };

});