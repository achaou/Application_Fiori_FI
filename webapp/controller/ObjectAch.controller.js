sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, History, formatter ,Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("finalproject.controller.ObjectAch", {

        formatter: formatter,
        id : '',
     

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
           
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                    busy : false,
                    delay : 0,
                    lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading"),
                    frequencyU : 0,
                    detail : ''

                });
            

            this.getRouter().getRoute("objectAch").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectAchView");
            // this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
        },
       
       
        onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			// this.getOwnerComponent().oListSelector.clearMasterListSelection();
            this.getModel("appView").setProperty("/layout", "OneColumn")
			this.getRouter().navTo("DemandeAch");
		},
        toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}

		},
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
       /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * 
         * @public
         */
       onNavBack : function() {
        // eslint-disable-next-line sap-no-history-manipulation
        // history.go(-1);
        this.getModel("appView").setProperty("/layout", "OneColumn");

        sap.ui.core.UIComponent.getRouterFor(this).navTo("Home")
    },
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched : function (oEvent) {
            var oArgument = oEvent.getParameter("arguments")
            console.log(oArgument)
            var sObjectId =  oEvent.getParameter("arguments").objectId;

            if (this.getModel("appView").getProperty("/layout") !== "MidColumnFullScreen") {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			}
            var id = sObjectId
            id = id.substring(id.length-2 , 2)
			let value1 = id
            value1 = parseInt(value1).toString();
			if(id.length < 10){
				do{
	
				id = '0'+id
	
			   }while(id.length < 10)
			}
            // value1 = id
            console.log(value1)
			id = "('"+id+"')"
            
            this.id= id;
            
            
            
          var oModell = this.getOwnerComponent().getModel();
          
          var oViewModel = this.getModel("objectAchView")
        //  sap.ui.core.UIComponent.getRouterFor(this).navTo("DemandeAch")
           
 
            this._bindView("/DemandeSet" + id);
            // this._bindTab("/postecommandeSet" , id);
            // this.getRouter().getTargets().display("worklist");
            
            
           
            oModell.read("/postedemandeSet" , {success: function(odata, response){
                console.log(odata)
                var items = []
                    for(var i=0 ; i<odata.results.length ; i++){
                        
                        if(value1 == odata.results[i].DemandeAchat){
                            console.log(odata.results[i].DemandeAchat)
                            items.push(odata.results[i])
                        }
                    }
                    oViewModel.setProperty("/detail" , items)
                    console.log(items)
                    console.log(oViewModel.getData())

         }})
        },

         /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */

        onSelectionChange : function(oEvent){
            console.log(oEvent.getSource().sId)
            let target = oEvent.getSource().sId.substring("application-finalproject-display-component---objectAch--_IDGenColumnListItem1-application-finalproject-display-component---objectAch--table-".length)
            var item = this.getModel("objectAchView").getProperty("/detail/"+target)
            // this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", true);
            // // this.getModel("appView").setProperty("/layout", "OneColumn");
            console.log(item)
            // console.log(target);
                        this._showDetail(item);
            // this.getModel("appView").setProperty("/layout", "OneColumn");
        },
        _showDetail : function (oItem) {
            
            // set the layout property of FCL control to show two columns
            // this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
    
            // this.getModel("appView").setProperty("/mixed", false);
            // console.log(oItem);

            this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
                 
            this.getRouter().navTo("objectDetailAch", {
                orderId: oItem.DemandeAchat,
                postId : oItem.PosteDemande
            });
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView : function (sObjectPath) {
            var oViewModel = this.getModel("objectAchView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange : function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectAchView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.DemandeAchat,
                sObjectName = oObject.DemandeSet;

                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/shareSendEmailSubject",
                    oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
                oViewModel.setProperty("/shareSendEmailMessage",
                    oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },
        valider: function(){
            var oModel = this.getOwnerComponent().getModel();
            console.log(this.id)
            oModel.read("/DemandeSet"+this.id , { success :function (odata , response){
				odata.Status = 'X'
	
				oModel.create("/DemandeSet", odata , {success : function(response){ 
					console.log("success");
			   }, error : function(error){
			   } })
	
			}, error : function(error){
				
	
			}})


        }
    });

});
