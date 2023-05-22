sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/f/library"
    

], function (BaseController, JSONModel, formatter, Filter, FilterOperator , Fragment , fioriLibrary) {
    "use strict";
    var LayoutType = fioriLibrary.LayoutType;
    return BaseController.extend("finalproject.controller.DemandeAch", {

        formatter: formatter,
        filterV : false , 
		filterN : false,
        

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the DemandeAch controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                DemandeAchTableTitle : this.getResourceBundle().getText("DemandeAchTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailDemandeAchSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailDemandeAchMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "DemandeAchView");
          
            
            this._onGetPercentage()

        },
        _onGetPercentage : function(){
            var mod = this.getOwnerComponent().getModel()
            var oRadialMicroChart = this.getView().byId("_IDGenHarveyBallMicroChartItemFirst");
            var oRadialMicroChart2 = this.getView().byId("_IDGenHarveyBallMicroChartItemThird");
            mod.read("/DemandeSet",{success: function(odata, response){
                var s = 0
                for(var i = 0  ; i< odata.results.length ; i++){
                    
                    if (odata.results[i].Status == 'X'){
                        s = s + 1 ;
                    }
                    
                }
                s = (s * 100) / odata.results.length
                
                oRadialMicroChart.setFraction(100-s)
                oRadialMicroChart2.setFraction(s)
                
                   
            }, error : function(error){
                alert("error")
            }
            }) 

    },
    FilterN : function(oEvent){
        
        if(this.filterN == false) {
        var aTableSearchState = [new Filter("Status", FilterOperator.EQ, ' ')];
        var oTable = this.byId("table")
        console.log(aTableSearchState);
        oTable.getBinding("items").filter(aTableSearchState, "Application");
        this.filterN = true
        this.filterV = false
        }else{
            var oTable = this.byId("table");
            oTable.getBinding("items").filter([], "Application");
            this.filterN = false
        }
    },
    FilterV : function(oEvent){
        if(this.filterV == false){
        var aTableSearchState = [new Filter("Status", FilterOperator.EQ, 'X')];
        var oTable = this.byId("table")
        console.log(aTableSearchState);
        oTable.getBinding("items").filter(aTableSearchState, "Application");
        this.filterV = true
        this.filterF = false
        }else{
            var oTable = this.byId("table");
            oTable.getBinding("items").filter([], "Application");
            this.filterV = false

        }

    },

    onSelectionChange : function(oEvent){
        this._showDetail(oEvent.getSource());
    },
    _showDetail : function (oItem) {
        
        // set the layout property of FCL control to show two columns
        this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

        this.getModel("appView").setProperty("/mixed", false);
        
        
        this.getRouter().navTo("objectAch", {
            objectId: oItem.getBindingContext().getPath().substring("/DemandeSet".length)
        });
    },

    refreshFilter : function () {
        var oTable = this.byId("table")
        oTable.getBinding("items").filter([], "Application");
        this.filterV = false
        this.filterN = false

    },
    
    onOpenViewSettings : function (oEvent) {
			var sDialogTab = "filter";
			if (oEvent.getSource().isA("sap.m.Button")) {
				var sButtonId = oEvent.getSource().getId();
				if (sButtonId.match("sort")) {
					sDialogTab = "sort";
				} else if (sButtonId.match("group")) {
					sDialogTab = "group";
				}
			}
			// load asynchronous XML fragment
			if (!this._pViewSettingsDialog) {
				this._pViewSettingsDialog = Fragment.load({
					id: this.getView().getId(),
					name: "finalproject.view.ViewSettingDialog",
					controller: this
				}).then(function(oDialog){
					// connect dialog to the root view of this component (models, lifecycle)
					this.getView().addDependent(oDialog);
					oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					return oDialog;
				}.bind(this));
			}
			this._pViewSettingsDialog.then(function(oDialog) {
				oDialog.open(sDialogTab);
			});
		},
        onUpdateFinished : function (oEvent) {
            // update the DemandeAch's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("DemandeAchTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("DemandeAchTableTitle");
            }
            this.getModel("DemandeAchView").setProperty("/DemandeAchTableTitle", sTitle);
        },

        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            // history.go(-1);
            this.getModel("appView").setProperty("/layout", "OneColumn");
            sap.ui.core.UIComponent.getRouterFor(this).navTo("Home")
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");
                console.log(sQuery)
            
                let id = sQuery
                if(id.length < 10){
                    do{
        
                    id = '0'+id
        
                   }while(id.length < 10)
                }
    

                console.log(id);

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("DemandeAchat", FilterOperator.EQ, id)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
            
        },



    

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("DemandeAchView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("DemandeAchNoDataWithSearchText"));
            }
        },

        onConfirmViewSettingsDialog : function (oEvent) {
			var aFilterItems = oEvent.getParameter("filterItems"),
			aFilters = [],
			aCaptions = [];
            
               
			aFilterItems.forEach(function (oItem) {
				switch (oItem.getKey()) {
					case "Valid":
						aFilters.push(new Filter("Status", FilterOperator.EQ, "X"));
						break;
					case "NonValid":
						aFilters.push(new Filter("Status", FilterOperator.NE, "X"));
						break;
					default:
					break;
				}
				aCaptions.push(oItem.getText());
			});
            var aFilter  = aFilters;
			// this._updateFilterBar(aCaptions.join(", "));
			this._applySearch(aFilter);
			// this._applyGrouper(oEvent);
		},
        onShareEmailPress : function(){
            this.getModel("appView").setProperty("/layout", "OneColumn");

            sap.ui.core.UIComponent.getRouterFor(this).navTo("Home")

        },
        _onIncPercentage : function(){
			var mod = this.getOwnerComponent().getModel()
			var oRadialMicroChart = this.getView().byId("_IDGenHarveyBallMicroChartItemFirst");
			var oRadialMicroChart2 = this.getView().byId("_IDGenHarveyBallMicroChartItemThird");
			mod.read("/DemandeSet",{success: function(odata, response){
                console.log(odata)
				 var s = oRadialMicroChart2.getFraction()+(100/odata.results.length)
				
				oRadialMicroChart.setFraction(100-s)
				oRadialMicroChart2.setFraction(s)
				
				   
			}, error : function(error){
				alert("error")
			}
			})
			

	    },
        Valider : function (OEvent){
			console.log("heelo");
			this._onIncPercentage()
           
			var oModel = this.getOwnerComponent().getModel();
			var id = OEvent.getSource().getParent().getParent().getCells()[0].mProperties.text
			console.log(id);
			if(id.length < 10){
				do{
	
				id = '0'+id
	
			   }while(id.length < 10)
			}
		// //    var rout = this.getRouter()
                oModel.read("/DemandeSet('"+id+"')" , { success :function (odata , response){
                    odata.Status = 'X'

                    oModel.create("/DemandeSet", odata , {success : function(response){ 
                        console.log("success");
                }, error : function(error){
                } })

                }, error : function(error){
                    

                }})

			
	
		   
		},





    });
});
