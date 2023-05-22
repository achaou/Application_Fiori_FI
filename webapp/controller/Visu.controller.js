sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/f/library",
    "sap/ui/core/routing/HashChanger",
], function(BaseController, JSONModel, formatter, Filter, FilterOperator , Fragment , fioriLibrary , History) {
    "use strict";

    return BaseController.extend("finalproject.controller.Visu", {
        formatter: formatter,
        onInit: function() {
            var chartConfigModel = new JSONModel({
                vizType : "line",
                Datasets: ''
            })
            this.setModel(chartConfigModel,"chartConfig");
           
            this.getRouter().getRoute("visualisation").attachPatternMatched(this.getBinding, this);

            

            
            
        },
        getBinding : function(oEvent){
            console.log(History.getInstance().getHash().substring("visualisation/?tab=".length));
            var item = History.getInstance().getHash().substring("visualisation/?tab=".length)
           
            if(item.length > 0){
                var mod = this.getOwnerComponent().getModel()
                var chartConfigModel = this.getModel("chartConfig")
                if(item == "Demande"){
              
                mod.read("/DemandeSet",{success: function(odata, response){
                    var items = []
                    var dateMY ; 
                    for(var j = 1 ; j <= 12 ; j++){
                        let Valide = 0 ;
                        let En_cours = 0;
                        
                    for(var i= 0  ; i< odata.results.length ; i++){
                     
                        var date = new Date(odata.results[i].DateCreation) 
                        // var yeara = new Date().getFullYear() 
                        var Mois =   date.getMonth() + 1
                        // var year = new Date(odata.results[i].Erdat).getFullYear() 
    
                        if (Mois == j ){
                            if(odata.results[i].Status == 'X'){
                                 Valide = Valide + 1 ;
                            }else{
                                En_cours = En_cours + 1;
                            }
                        }
                        // dateMY = new Date(yeara , j-1 , 1);
                        Mois = j 
                    }
                    items.push({Mois , Valide , En_cours})
                }
                    chartConfigModel.setProperty("/Datasets", items)       
                    // .setData("frequency",items) 
                    console.log(chartConfigModel.getData("Datasets"))
                       
                }, error : function(error){
                    alert("error")
                }
                }) 
            }
            else if(item == "commandeA"){
                mod.read("/CommandeSet",{success: function(odata, response){
                    var items = []
                    var dateMY ; 
                    for(var j = 1 ; j <= 12 ; j++){
                        let Valide = 0 ;
                        let En_cours = 0;
                        
                    for(var i= 0  ; i< odata.results.length ; i++){
                     
                        var date = new Date(odata.results[i].Datecreation) 
                        // var yeara = new Date().getFullYear() 
                        var Mois =   date.getMonth() + 1
                        // var year = new Date(odata.results[i].Erdat).getFullYear() 
    
                        if (Mois == j ){
                            if(odata.results[i].Statut == 'X'){
                                 Valide = Valide + 1 ;
                            }else{
                                En_cours = En_cours + 1;
                            }
                        }
                        // dateMY = new Date(yeara , j-1 , 1);
                        Mois = j 
                    }
                    items.push({Mois , Valide , En_cours})
                }
                      chartConfigModel.setProperty("/Datasets", null)
                    console.log(item);
                    chartConfigModel.setProperty("/Datasets", items)       
                    // .setData("frequency",items) 
                    console.log(chartConfigModel.getData("Datasets"))
                       
                }, error : function(error){
                    alert("error")
                }
                }) 
            }else{
                let mod = this.getOwnerComponent().getModel("SD")
                mod.read("/ZORDER_HEADERSSet",{success: function(odata, response){
                    var items = []
                    var dateMY ; 
                    for(var j = 1 ; j <= 12 ; j++){
                        let Valide = 0 ;
                        let En_cours = 0;
                        
                    for(var i= 0  ; i< odata.results.length ; i++){
                     
                        var date = new Date(odata.results[i].Orderdate) 
                        // var yeara = new Date().getFullYear() 
                        var Mois =   date.getMonth() + 1
                        // var year = new Date(odata.results[i].Erdat).getFullYear() 
    
                        if (Mois == j ){
                            if(odata.results[i].Status == 'Valid'){
                                 Valide = Valide + 1 ;
                            }else{
                                En_cours = En_cours + 1;
                            }
                        }
                        // dateMY = new Date(yeara , j-1 , 1);
                        Mois = j 
                    }
                    items.push({Mois , Valide , En_cours})
                }
                      chartConfigModel.setProperty("/Datasets", null)
                    console.log(item);
                    chartConfigModel.setProperty("/Datasets", items)       
                    // .setData("frequency",items) 
                    console.log(chartConfigModel.getData("Datasets"))
                       
                }, error : function(error){
                    alert("error")
                }
                }) 

            }
				
			} else {
				this.getRouter().navTo("visualisation", {
					query: {
						tab: "Demande"
					}
				}, true);
			}
           
        },
        onMesureChanged:function(event){
            var selectedListItem = event.getParameter("listItem");
            var selectedItemId = selectedListItem.getId();
            // split the id of the parent control  = application-fluxfinance-display-component---visualisation--demande_d_achat
            var idParts = selectedItemId.split("--");
            var itemId = idParts[idParts.length - 1];

        
            switch (itemId) {
                case "demande_d_achat":
                    this.makeTitle("Analyse des données par le biais de demandes d achats");
                    this.getRouter().navTo("visualisation", {
                        query: {
                            tab: "Demande"
                        }
                    }, true);
                    break;
                case "commande_achat":
                    this.makeTitle("Analyse des données par le biais de commandes d achats");
                    this.getRouter().navTo("visualisation", {
                       
                        query: {
                            tab: "commandeA"
                        }
                    }, true);
                    break;
                case "commande_vente":
                    this.makeTitle("Analyse des données par le biais de commandes de vente");
                    this.getRouter().navTo("visualisation", {
                        
                        query: {
                            tab: "commandeV"
                        }
                    }, true);
                    break;
                default:
                    break;
            }
        },

		makeTitle: function(title) {
			var vizFrame = this.byId("idVizFrame");
            vizFrame.setVizProperties(
                {
                    title : {
                        text : title
                    }
                }
            )
		},
        onChartTypeChanged:function(event){
            var selectedItem = event.getParameter("selectedItem");
            var selectedItemId = selectedItem.getId();

            // split the id of the parent control  = application-fluxfinance-display-component---visualisation--demande_d_achat
            var idParts = selectedItemId.split("--");
            var itemId = idParts[idParts.length - 1];

            var oModel = this.getView().getModel("chartConfig");
           
            console.log(itemId);
            switch (itemId) {
                case "chart_bar":
                    oModel.setProperty("/vizType","bar");
                    console.log(oModel.getData());
                    console.log(itemId);
                    break;
                case "chart_line":
                    console.log(oModel.getData());
                    oModel.setProperty("/vizType","line")
                    break;
                case "chart_column":
                    oModel.setProperty("/vizType","column")
                    break;
                case "chart_stacked":
                    oModel.setProperty("/vizType","stacked_bar")
                    break;
                default:
                    break;
            }
        }
        
    });
});
