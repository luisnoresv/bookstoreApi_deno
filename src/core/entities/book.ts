export interface Book {
  _id: string;
  title: string;
  url: string;
  author: string;
  isbn: string;
}

export interface BookSchema {
  _id: {
    $oid: string;
  };
  title: string;
  url: string;
  author: string;
  isbn: string;
}
