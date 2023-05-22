sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/HashChanger",
], function (BaseController , History) {
    "use strict";

    return BaseController.extend("finalproject.controller.Home", {
        

        onInit : function(){
          console.log(  this.getRouter())
        },
         /**
         * Navigates to the worklist when the link is pressed
         * @public
         */

       
        onLinkPressed : function () {
            // this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

			// this.getRouter().navTo("worklist");
            sap.ui.core.UIComponent.getRouterFor(this).navTo("Vente")
            
            // console.log(this.getOwnerComponent().byId("layout")); 
            //  .toBeginColumnPage("worklist") ;
            // this.getRouter().getTargets().display("worklist");
            
        }

    });

});