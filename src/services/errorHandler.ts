import { Request, Response } from "express";

const errorHandler = (fn: Function) => {
  return (req: Request, res: Response) => {
    fn(req, res).catch((err: Error) => {
      console.error(err);
      res.status(500).json({
        message: "An unexpected error occurred",
        error: err.message,
      });
    });
  };
};

export default errorHandler;
