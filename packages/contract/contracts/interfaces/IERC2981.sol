interface IERC2981 {
    /**
     * @notice Called with the sale price to determine how much royalty
     *         is owed and to whom.
     * @param tokenId - the NFT asset queried for royalty information
     * @param salePrice - sale price of the NFT asset specified by `tokenId`
     * @return receiver - address of who should be sent the royalty payment
     * @return royaltyAmount - the royalty payment amount for `salePrice`
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        returns (address receiver, uint256 royaltyAmount);
}
