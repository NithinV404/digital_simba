import { Prisma } from "@prisma/client";

const handlePrismaError = (error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        return {
          status: 400,
          message: "The value you entered is too long. Please shorten it.",
        };
      case "P2001":
        return {
          status: 404,
          message: "We could not find what you were looking for.",
        };
      case "P2002":
        return { status: 400, message: "The user already exits." };
      case "P2003":
        return {
          status: 400,
          message:
            "This item is linked to something else. Remove the link first.",
        };
      case "P2004":
        return {
          status: 400,
          message: "A rule was violated. Please review your input.",
        };
      case "P2005":
        return {
          status: 400,
          message: "One of the values looks incorrect. Please check it.",
        };
      case "P2006":
        return {
          status: 400,
          message: "A value has the wrong type. Please adjust it.",
        };
      case "P2007":
        return {
          status: 400,
          message: "Some data failed validation. Please verify your entries.",
        };
      case "P2008":
        return {
          status: 400,
          message: "There was a problem understanding the query.",
        };
      case "P2009":
        return {
          status: 400,
          message: "The query is not valid. Please review it.",
        };
      case "P2010":
        return {
          status: 500,
          message: "We had trouble running that request. Please try again.",
        };
      case "P2011":
        return { status: 400, message: "A required value cannot be empty." };
      case "P2012":
        return { status: 400, message: "A required field is missing." };
      case "P2013":
        return { status: 400, message: "A required argument is missing." };
      case "P2014":
        return {
          status: 400,
          message: "The relationship you set up is not allowed.",
        };
      case "P2015":
        return {
          status: 404,
          message: "We could not complete the related lookup.",
        };
      case "P2016":
        return {
          status: 400,
          message: "We could not understand part of the request.",
        };
      case "P2017":
        return {
          status: 400,
          message: "Related records are not linked correctly.",
        };
      case "P2018":
        return { status: 404, message: "Required related data was not found." };
      case "P2019":
        return {
          status: 400,
          message: "Something in the input is not quite right.",
        };
      case "P2020":
        return {
          status: 400,
          message: "One of the values is out of the allowed range.",
        };
      case "P2021":
        return {
          status: 404,
          message: "The table you requested does not exist.",
        };
      case "P2022":
        return {
          status: 404,
          message: "The column you requested does not exist.",
        };
      case "P2023":
        return {
          status: 400,
          message: "The data in a column is inconsistent. Please review.",
        };
      case "P2024":
        return {
          status: 500,
          message:
            "Something went wrong with the transaction. Please try again.",
        };
      case "P2025":
        return {
          status: 404,
          message: "We could not find the requested record.",
        };
      default:
        return {
          status: 500,
          message: "Something went wrong on our side. Please try again later.",
        };
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const lastPart = error.message.split("\n").pop().trim();
    return { status: 400, message: `Please check your input: ${lastPart}` };
  } else {
    return {
      status: 500,
      message: "We could not process your request. Please try again later.",
    };
  }
};

export { handlePrismaError };
