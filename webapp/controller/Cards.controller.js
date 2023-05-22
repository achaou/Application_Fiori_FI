sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
  ], function(Controller, JSONModel) {
	"use strict";
  
	return Controller.extend("finalproject.controller.Cards", {
	  onInit: function() {
		var oModel = new JSONModel({
		  totalCommande_achat: 0,
		  totalCommande_vente: 0,
		  commande_Achat_encours: 0,
		  commande_Vente_encours: 0
		});
  
		this.getView().setModel(oModel, "navData");
		this.updateValue(); // Call the updateValue function to update the value
	  },
  
	  onShowHello: function() {
		// show a native JavaScript alert
		// alert("Hello World");
        sap.ui.core.UIComponent.getRouterFor(this).navTo("worklist")


	  },
      onShowDemande : function(){
        sap.ui.core.UIComponent.getRouterFor(this).navTo("DemandeAch")     
      },
	  updateValue: function() {
		var oModel = this.getView().getModel("navData");
		var newValue = 20;
		oModel.setProperty("/totalCommande_achat", newValue);
		oModel.setProperty("/totalCommande_vente", 80);
	  },

		goToVisualization: function(oEvent) {
            sap.ui.core.UIComponent.getRouterFor(this).navTo("visualisation")   
            
	
		},
		goToVente: function(){
			console.log("here")
			// this.getRouter().getTargets().display("vente")
			sap.ui.core.UIComponent.getRouterFor(this).navTo("vente")   


		}
	});
  });