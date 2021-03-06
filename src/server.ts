import { Product } from './apis/product.api';
import { Category } from './apis/category.api';
import { User } from './apis/user.api';
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import { IndexRoute } from "./routes/index.route";
var config = require("../config.json") //import config file
import mongoose = require("mongoose"); //import mongoose

//api 
import { API } from './apis/api';

//interfaces
import { IUser } from "./interfaces/user.interface"; //import IUser

//models
import { IModel } from "./models/model"; //import IModel
import { IUserModel } from "./models/user.model"; //import IUserModel

//schemas
import { userSchema } from "./schemas/user.schema"; //import userSchema
import { DatabaseConnection } from "./utilities/databaseconnection"
/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  private model: IModel; //an instance of IModel

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
     this.model = Object(); 
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
   // this.routes();

    //add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    this.app.use("/",(new API).getRouter());
    this.app.use("/user/", (new User).getRouter());
    this.app.use("/category/", (new Category).getRouter());
    this.app.use("/product/", (new Product).getRouter());
  }

  /**
    * Configure application
    *
    * @class Server
    * @method config
    */
    
  public config() {

    //use q promises
    global.Promise = require("q").Promise;
    mongoose.Promise = global.Promise;

    //connect to mongoose
    DatabaseConnection.openConnection();

    // //create models
    // this.setModels(connection);
    
    
    //etag
    this.app.set('etag', false);
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //configure pug
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");

    //use logger middlware
    this.app.use(logger("dev"));

    //use json form parser middlware
    this.app.use(bodyParser.json());

    //use query string parser middlware
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //use cookie parker middleware middlware
    this.app.use(cookieParser(config["cookie_secret"]));

    //use override middlware
    this.app.use(methodOverride());

    //catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }

    /**
    * Create router.
    *
    * @class Server
    * @method routes
    * @return void
    */
  private routes() {
    let router: express.Router;
    router = express.Router();

    //IndexRoute
    IndexRoute.create(router);
    
    //use router middleware
    this.app.use(router);
  }
  /**
    * Create database models.
    *
    * @class Server
    * @method setModels
    * @return void
    */
  // private setModels(connection : mongoose.Connection){
  //     this.model.user = connection.model<IUserModel>("User", userSchema);
  // }

}