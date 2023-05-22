sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController , JSONModel) {
    "use strict";

    return BaseController.extend("finalproject.controller.App", {

        onInit : function () {
            var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : true,
				delay : 0,
                mixed: true,
				layout : "OneColumn",
				previousLayout : "",
				actionButtonsInfo : {
					midColumn : {
						fullScreen : false
					},
					endColumn : {
						fullScreen : false
					}
				}
			});
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
			// sLayout = oNextUIState.layout;
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			// since then() has no "reject"-path attach to the MetadataFailed-Event to disable the busy indicator in case of an error
			this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
			this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        },
		onNavBack : function() {
			// eslint-disable-next-line sap-no-history-manipulation
			// history.go(-1);
			console.log("here")
			this.getModel("appView").setProperty("/layout", "OneColumn");
	
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Home")
		},
		
		
    });

});