sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	var PageController = Controller.extend("finalproject.controller.test", {

		onInit : function () {
			this._sValidPath = sap.ui.require.toUrl("sap/opu/odata/sap/ZODATA_INWI_FI_FACTURATION_SRV/MM_FACINWISet('0010000001')/$value");
			this._sInvalidPath = sap.ui.require.toUrl("sap/m/sample/PDFViewerEmbedded/sample_nonexisting.pdf");
            console.log(this._sValidPath)
			this._oModel = new JSONModel({
				Source: this._sValidPath,
				Title: "Test Facturation",
				Height: "600px"
			});
			this.getView().setModel(this._oModel , "test");
		},

		onCorrectPathClick: function() {
			this._oModel.setProperty("/Source", this._sValidPath);
		},

		onIncorrectPathClick: function() {
			this._oModel.setProperty("/Source", this._sInvalidPath);
		}
	});

	return PageController;

});