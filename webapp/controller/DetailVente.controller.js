sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (BaseController ,JSONModel, History, formatter ,Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("finalproject.controller.DetailVente", {
        formatter: formatter,


        onInit : function(){
            var oViewModel = new JSONModel({
                busy : false,
                delay : 0,
                article : '',
                fournisseur : ''
            });
           
            this.getRouter().getRoute("objectDetailVente").attachPatternMatched(this._onObjectMatched, this);
            
            this.setModel(oViewModel , "DetailVenteView")
            // console.log(oViewModel.getData());

           
        },
        _onObjectMatched : function (oEvent) {
            
           
            // this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen" , false);
            this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
            // console.log(this.getModel("appView").getProperty("/actionButtonsInfo/endColumn/fullScreen"));
            var oArgument = oEvent.getParameter("arguments")
            console.log(oArgument)
            var sObjectId =  oEvent.getParameter("arguments").orderId;
            var sPostId =  oEvent.getParameter("arguments").postId;

            console.log(sObjectId);
            

            let id = sObjectId
            
            if(id.length < 10){
				do{
	
				id = '0'+id
	
			   }while(id.length < 10)
			}

            this._id = id;

            var oModell = this.getOwnerComponent().getModel("SD");
            

            var path= "/ZORDER_POSTSSet(Postid='"+sPostId+"')"
            

            this._bindView(path , id , sPostId);
            this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn", true);
            this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
			

          
            // this.getRouter().getTargets().display("worklist");
        },
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            // history.go(-1);
            this.getModel("appView").setProperty("/layout", "OneColumn");
    
            sap.ui.core.UIComponent.getRouterFor(this).navTo("Home")
        },
        _bindView : function (sObjectPath , id , sPostId) {
            var oViewModel = this.getModel("DetailVenteView");
            var oModell = this.getOwnerComponent().getModel("SD");
            var s ;
            oModell.read(sObjectPath,{success: function(odata, response){

                var s = odata.Productid
                if(s != null){
                console.log(s)
                if(s.length == 7){
                if(s.length < 18){
                    do{
        
                    s = '0'+s
        
                   }while(s.length < 18)
                }
            }
                console.log(s)
    
                
                oModell.read("/ZPRODUCTSet('"+s+"')" ,{success: function(odata, response){
                   

                    console.log(odata)
                    oViewModel.setProperty("/article",odata)
                    
                }
                }) 
            }

                console.log(oViewModel.getData())
            }
        })

            this.getView().bindElement({
                path: "SD>"+sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                }
            });
            console.log("hey")
        },
        _onBindingChange : function () {
         
        },
        onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			// this.getOwnerComponent().oListSelector.clearMasterListSelection();
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded")
            this.getRouter().navTo("objectVente", {
                objectId: "('"+this._id+"')"
            });
			
		}, 
        toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/endColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}

		},
        
        
        
     

    });

});