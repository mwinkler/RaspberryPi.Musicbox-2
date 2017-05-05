
interface IAlbumPage {
    currentPage: number;
    totalPages: number;
    albums: IAlbum[];
    totalAlbums: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasSubAlbums: boolean;
}