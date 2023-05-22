sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("finalproject.controller.NotFound", {

        /**
         * Navigates to the worklist when the link is pressed
         * @public
         */
        onInit : function(){
            // this.getRouter().navTo("worklist");


        },
        onLinkPressed : function () {
            this.getRouter().navTo("worklist");

            // this.getRouter().getTargets().display("worklist");
        }

    });

});