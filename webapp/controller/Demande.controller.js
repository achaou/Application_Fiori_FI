sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController , JSONModel) {
    "use strict";

    return BaseController.extend("finalproject.controller.Demande", {

        onInit : function () {
            var oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                title:{
                    text : "Commande D'achat pour l'année " + new Date().getFullYear(),
                    visible: true
                },
                timeAxis : {
                levels: ['month' , 'yaer'], 
                levelConfig:{
                        month:{formatString:'MM'},
                        year:{ formatString:'yyyy'}
                    },
                title: {visible: true}
                },
            // categoryAxis : {title: {visible: true}},
            plotArea: {
                window: {
                    start: "firstDataPoint",
                    end: "lastDataPoint"
                }
            },

            legend: {
                visible: true
            }
            });
            oVizFrame.setVizProperties({
                title:{
                    text : "Commande D'achat pour l'année " + new Date().getFullYear(),
                    visible: true
                },
                timeAxis : {
                levels: ['month' , 'yaer'], 
                levelConfig:{
                        month:{formatString:'MM'},
                        year:{ formatString:'yyyy'}
                    },
                title: {visible: true}
                },
            // categoryAxis : {title: {visible: true}},
            plotArea: {
                window: {
                    start: "firstDataPoint",
                    end: "lastDataPoint"
                }
            },

            legend: {
                visible: true
            }
            });
           
        },
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            // history.go(-1);
            this.getModel("appView").setProperty("/layout", "OneColumn");
    
            sap.ui.core.UIComponent.getRouterFor(this).navTo("Home")
        },
		
    });

});