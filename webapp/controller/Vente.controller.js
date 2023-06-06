sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/f/library",
    "sap/ui/core/routing/History",
    

], function (BaseController, JSONModel, formatter, Filter, FilterOperator , Fragment , fioriLibrary , History) {
    "use strict";
    var LayoutType = fioriLibrary.LayoutType;
    return BaseController.extend("finalproject.controller.Vente", {

        formatter: formatter,
        filterV : false , 
		filterN : false,
        

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            
            var oViewModel;
            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "venteView");
            
          
            
            this._onGetPercentage()
           


        },
        _onGetPercentage : function(){
            // this.getModel("appView").setProperty("/layout", "OnColumn");
            var mod = this.getOwnerComponent().getModel("SD")
            var oRadialMicroChart = this.getView().byId("_IDGenHarveyBallMicroChartItemFirst");
            var oRadialMicroChart2 = this.getView().byId("_IDGenHarveyBallMicroChartItemThird");
            mod.read("/ZORDER_HEADERSSet",{success: function(odata, response){
                var s = 0
                for(var i = 0  ; i< odata.results.length ; i++){
                    
                    if (odata.results[i].Status == 'Valid'){
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
        var aTableSearchState = [new Filter("Status", FilterOperator.EQ, 'Not Valid')];
        var oTable = this.byId("table")
        console.log(aTableSearchState);
        console.log(oTable.getBinding("items" , "SD"))
        oTable.getBinding("items" , "SD").filter(aTableSearchState, "Application");
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
        var aTableSearchState = [new Filter("Status", FilterOperator.EQ, 'Valid')];
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
        // console.log(oEvent.getSource().getBindingContext("SD"))
        this._showDetail(oEvent.getSource());
    },
    _showDetail : function (oItem) {
        
        // set the layout property of FCL control to show two columns
        this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

        this.getModel("appView").setProperty("/mixed", false);
        
        
        this.getRouter().navTo("objectVente", {
            objectId: oItem.getBindingContext("SD").getPath().substring("/ZORDER_HEADERSSet".length)
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


        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("venteView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            this.getModel("appView").setProperty("/layout", "OneColumn");

            sap.ui.core.UIComponent.getRouterFor(this).navTo("Home")
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
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
                    aTableSearchState = [new Filter("OrderId", FilterOperator.EQ, id)];
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
                oViewModel = this.getModel("venteView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        },

        onConfirmViewSettingsDialog : function (oEvent) {
			var aFilterItems = oEvent.getParameter("filterItems"),
			aFilters = [],
			aCaptions = [];
            
               
			aFilterItems.forEach(function (oItem) {
				switch (oItem.getKey()) {
					case "Valid":
						aFilters.push(new Filter("Status", FilterOperator.EQ, "Valid"));
						break;
					case "NonValid":
						aFilters.push(new Filter("Status", FilterOperator.NE, "Valid"));
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
			var mod = this.getOwnerComponent().getModel("SD")
			var oRadialMicroChart = this.getView().byId("_IDGenHarveyBallMicroChartItemFirst");
			var oRadialMicroChart2 = this.getView().byId("_IDGenHarveyBallMicroChartItemThird");
			mod.read("/ZORDER_HEADERSSet",{success: function(odata, response){
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
           
			var oModel = this.getOwnerComponent().getModel("SD");
			var id = OEvent.getSource().getParent().getParent().getCells()[0].mProperties.text
			console.log(id);
			if(id.length < 10){
				do{
	
				id = '0'+id
	
			   }while(id.length < 10)
			}
                oModel.read("/ZORDER_HEADERSSet('"+id+"')" , { success :function (odata , response){
                    odata.Status = 'Valid'

                    oModel.create("/ZORDER_HEADERSSet", odata , {success : function(response){ 
                        console.log("success");
                }, error : function(error){
                } })

                }, error : function(error){
                    

                }})
		   
		},
        Imprimer : function(oEvent){
            var oModel = this.getOwnerComponent().getModel("SD");
			var id = oEvent.getSource().getParent().getParent().getCells()[0].mProperties.text
			console.log(id);
			if(id.length < 10){
				do{
	
				id = '0'+id
	
			   }while(id.length < 10)
			}
            // http://10.104.12.91:8000/sap/opu/odata/SAP/ZODATA_INWI_SD_FI_SRV/SD_MAILSet(ORDERID='6000000152')/$value
            var opdfViewer = new sap.m.PDFViewer();
			this.getView().addDependent(opdfViewer);
			var sServiceURL = oModel.sServiceUrl;
			var sSource = "http://10.104.12.91:8000"+ sServiceURL + "/SD_MAILSet(ORDERID='"+id+"')/$value";
            console.log(sSource)
			opdfViewer.setSource("../entity-9.pdf");
			opdfViewer.setTitle( "My PDF");
			opdfViewer.open();	
            // var w = window.open(sSource);
            // if (w == null) {
            //     MessageBox.warning(oBundle.getText("Error.BlockedPopUp"));
            // }
  
        },
        Mail : function (OEvent){
			console.log("heelo");
			// this._onIncPercentage()
			var oModel = this.getOwnerComponent().getModel("SD");
			var id = OEvent.getSource().getParent().getParent().getCells()[0].mProperties.text
			console.log(id);
			if(id.length < 10){
				do{
	
				id = '0'+id
	
			   }while(id.length < 10)
			}
                oModel.read("/MailSDSet('"+id+"')" , { success :function (odata , response){
                    alert("Mail sended successfully ")
                }, error : function(error){
                    alert("we can t send mail " + error)    

                }})
		   
		},
        
        // _updateFilterBar : function (sFilterBarText) {
		// 	var oViewModel = this.getModel("worklistView");
		// 	oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
		// 	oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		// }

    });
});
